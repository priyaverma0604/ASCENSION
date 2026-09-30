import React, { useEffect, useRef } from 'react';
import waterfallBg from '../assets/waterfall_bg.jpg';

const VERTEX_SHADER_SOURCE = `
  attribute vec2 aPosition;
  varying vec2 vUv;
  void main() {
    vUv = (aPosition + 1.0) * 0.5;
    // Flip Y for WebGL texture coordinates so (0,0) is top-left
    vUv.y = 1.0 - vUv.y;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SOURCE = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uImageResolution;

  // Calculate cover UV coordinates matching CSS object-fit: cover
  vec2 getCoverUV(vec2 screenUV, vec2 screenRes, vec2 imgRes) {
    float screenAspect = screenRes.x / screenRes.y;
    float imgAspect = imgRes.x / imgRes.y;
    vec2 uv = screenUV;
    if (screenAspect > imgAspect) {
      float scale = imgAspect / screenAspect;
      uv.y = (screenUV.y - 0.5) * scale + 0.5;
    } else {
      float scale = screenAspect / imgAspect;
      uv.x = (screenUV.x - 0.5) * scale + 0.5;
    }
    return uv;
  }

  // Explicit Rock and Solid Ground Exclusion Mask (Returns 1.0 for solid rocks)
  float getRockExclusion(vec2 uv) {
    // 1. Large Left Boulders (x: ~0.04 to ~0.26, y: ~0.48 to ~0.76)
    float lRockH = smoothstep(0.02, 0.08, uv.x) * (1.0 - smoothstep(0.24, 0.30, uv.x));
    float lRockV = smoothstep(0.48, 0.54, uv.y) * (1.0 - smoothstep(0.74, 0.80, uv.y));
    float leftRocks = lRockH * lRockV;

    // 2. Center River Boulders (x: ~0.29 to ~0.55, y: ~0.60 to ~0.78)
    float cRockH = smoothstep(0.29, 0.34, uv.x) * (1.0 - smoothstep(0.52, 0.58, uv.x));
    float cRockV = smoothstep(0.61, 0.66, uv.y) * (1.0 - smoothstep(0.76, 0.82, uv.y));
    float centerRocks = cRockH * cRockV;

    // 3. Right Waterfall Rocks & Cliff Bank (x: ~0.74 to ~0.98, y: ~0.54 to ~0.85)
    float rRockH = smoothstep(0.74, 0.80, uv.x) * (1.0 - smoothstep(0.96, 1.00, uv.x));
    float rRockV = smoothstep(0.54, 0.60, uv.y) * (1.0 - smoothstep(0.84, 0.90, uv.y));
    float rightRocks = rRockH * rRockV;

    // 4. Wooden Meditation Deck & Healing Stones (y > 0.78)
    float deck = smoothstep(0.77, 0.83, uv.y);

    return clamp(leftRocks + centerRocks + rightRocks + deck, 0.0, 1.0);
  }

  // Pure Waterfall Water Cascade Mask (Exclusively targets the white water cascade)
  float getWaterCascadeMask(vec2 uv, vec4 pixelColor) {
    // Spatial bounding box tightly around the vertical waterfall cascade
    float wfH = smoothstep(0.635, 0.675, uv.x) * (1.0 - smoothstep(0.785, 0.825, uv.x));
    float wfV = smoothstep(0.280, 0.330, uv.y) * (1.0 - smoothstep(0.650, 0.700, uv.y));
    float spatialBox = wfH * wfV;

    if (spatialBox <= 0.001) return 0.0;

    // Pixel-color awareness: Water & foam are bright white/cyan (Luminance check)
    float luminance = dot(pixelColor.rgb, vec3(0.299, 0.587, 0.114));
    float isWaterColor = smoothstep(0.42, 0.60, luminance);

    return spatialBox * isWaterColor;
  }

  // Pure River Rapids Flow Mask (Exclusively targets white foam rapids between rocks)
  float getRiverRapidsMask(vec2 uv, vec4 pixelColor) {
    float rH = smoothstep(0.260, 0.380, uv.x) * (1.0 - smoothstep(0.720, 0.800, uv.x));
    float rV = smoothstep(0.570, 0.640, uv.y) * (1.0 - smoothstep(0.750, 0.810, uv.y));
    float spatialRiver = rH * rV;

    if (spatialRiver <= 0.001) return 0.0;

    float rockExclusion = getRockExclusion(uv);
    if (rockExclusion > 0.4) return 0.0;

    float luminance = dot(pixelColor.rgb, vec3(0.299, 0.587, 0.114));
    float isFoam = smoothstep(0.52, 0.72, luminance);

    return spatialRiver * isFoam * (1.0 - rockExclusion) * 0.35;
  }

  // Enhanced Foliage & Leaf Mask (Clearly targets canopy, hanging branches, bushes, deck plants)
  float getFoliageMask(vec2 uv, vec4 pixelColor) {
    // 1. Top-Left Canopy & Hanging Branches (x: 0.0 to 0.48, y: 0.0 to 0.40)
    float tlH = 1.0 - smoothstep(0.36, 0.50, uv.x);
    float tlV = 1.0 - smoothstep(0.26, 0.42, uv.y);
    float topCanopy = tlH * tlV;

    // 2. Top-Right Canopy above waterfall (x: 0.60 to 1.0, y: 0.0 to 0.32)
    float trH = smoothstep(0.60, 0.72, uv.x);
    float trV = 1.0 - smoothstep(0.18, 0.32, uv.y);
    float topRightCanopy = trH * trV * 0.90;

    // 3. Mid-Left Cliff Bushes (above big rocks) (x: 0.0 to 0.24, y: 0.22 to 0.48)
    float mlH = 1.0 - smoothstep(0.16, 0.26, uv.x);
    float mlV = smoothstep(0.22, 0.28, uv.y) * (1.0 - smoothstep(0.44, 0.50, uv.y));
    float midLeftBushes = mlH * mlV * 0.85;

    // 4. Potted Green Plant on deck (x: 0.0 to 0.22, y: 0.64 to 0.86)
    float dpH = 1.0 - smoothstep(0.14, 0.24, uv.x);
    float dpV = smoothstep(0.64, 0.70, uv.y) * (1.0 - smoothstep(0.84, 0.90, uv.y));
    float deckPlant = dpH * dpV * 0.90;

    float spatialFoliage = clamp(topCanopy + topRightCanopy + midLeftBushes + deckPlant, 0.0, 1.0);
    if (spatialFoliage <= 0.001) return 0.0;

    // Protect bright sun core from warping (x: ~0.18, y: ~0.16)
    float distToSun = length(uv - vec2(0.18, 0.16));
    float sunProt = smoothstep(0.08, 0.18, distToSun);

    // Subtract rocks & deck wood
    float rockExclusion = getRockExclusion(uv);

    // Color verification: Green or sunlit amber tones
    float greenDominance = pixelColor.g - max(pixelColor.r * 0.85, pixelColor.b * 0.9);
    float isGreenish = smoothstep(-0.02, 0.06, greenDominance);
    float hasGreenLuma = smoothstep(0.20, 0.60, pixelColor.g);
    float leafFactor = clamp(isGreenish * 0.7 + hasGreenLuma * 0.4, 0.0, 1.0);

    return spatialFoliage * sunProt * leafFactor * (1.0 - rockExclusion);
  }

  // Enhanced Natural Wind Breeze Sway for Leaves (Clear, graceful, vivid motion)
  vec2 getLeafWindSway(vec2 uv, float time, float foliageMask) {
    if (foliageMask <= 0.002) return vec2(0.0);

    // Spatial wind wave traveling diagonally across the tree canopy
    float windWave = uv.x * 4.2 + uv.y * 3.2 - time * 1.5;

    // Main branch sway (clearly visible, graceful swinging back and forth)
    float branchSway = sin(windWave) * 0.0125 + cos(windWave * 0.65 + time * 0.5) * 0.0075;

    // Dynamic leaflet fluttering (lively natural breeze vibration on leaves)
    float flutterX = sin(uv.x * 65.0 + uv.y * 45.0 + time * 3.8) * 0.0050;
    float flutterY = cos(uv.x * 50.0 - uv.y * 60.0 + time * 4.2) * 0.0035;

    // Natural wind gust envelope (gentle rise and fall)
    float gust = 0.80 + 0.25 * sin(time * 0.55);

    // Lateral sway + gentle vertical bounce
    return vec2(
      branchSway + flutterX,
      branchSway * 0.35 + flutterY
    ) * foliageMask * gust;
  }

  void main() {
    vec2 baseUv = getCoverUV(vUv, uResolution, uImageResolution);
    baseUv = clamp(baseUv, 0.0, 1.0);

    // Sample base pixel color
    vec4 baseColor = texture2D(uTexture, baseUv);

    // 1. Water Cascade & Rapids Mask
    float cascadeMask = getWaterCascadeMask(baseUv, baseColor);
    float rapidsMask = getRiverRapidsMask(baseUv, baseColor);
    float totalWaterMask = clamp(cascadeMask + rapidsMask, 0.0, 1.0);

    // --- WATER FLOW ANIMATION ---
    if (totalWaterMask > 0.002) {
      vec2 flowDir = vec2(-0.06, 0.98); // downward waterfall cascade
      if (rapidsMask > cascadeMask) {
        flowDir = vec2(-0.85, 0.35); // river rapids downstream
      }

      float speed = 0.16;
      float t1 = fract(uTime * speed);
      float t2 = fract(uTime * speed + 0.5);

      float w1 = sin(t1 * 3.14159265);
      float w2 = sin(t2 * 3.14159265);
      float totalW = w1 + w2;
      w1 /= totalW;
      w2 /= totalW;

      float flowMag = 0.035 * totalWaterMask;

      vec2 uv1 = baseUv + flowDir * (t1 - 0.5) * flowMag;
      vec2 uv2 = baseUv + flowDir * (t2 - 0.5) * flowMag;

      float microWave = sin(baseUv.y * 80.0 + uTime * 3.5) * 0.0010 * totalWaterMask;
      uv1.x += microWave;
      uv2.x -= microWave;

      vec4 color1 = texture2D(uTexture, clamp(uv1, 0.0, 1.0));
      vec4 color2 = texture2D(uTexture, clamp(uv2, 0.0, 1.0));

      vec4 waterColor = color1 * w1 + color2 * w2;

      float shimmer = sin(baseUv.y * 120.0 + uTime * 6.0) * cos(baseUv.x * 90.0 - uTime * 4.0);
      if (shimmer > 0.70 && cascadeMask > 0.3) {
        float shimmerStrength = (shimmer - 0.70) * 0.10 * cascadeMask;
        waterColor.rgb += vec3(shimmerStrength);
      }

      gl_FragColor = waterColor;
      return;
    }

    // --- LEAF & FOLIAGE BREEZE (ENHANCED, VIVID & NATURAL) ---
    float foliageMask = getFoliageMask(baseUv, baseColor);
    if (foliageMask > 0.002) {
      vec2 windOffset = getLeafWindSway(baseUv, uTime, foliageMask);
      vec2 foliageUv = clamp(baseUv + windOffset, 0.0, 1.0);
      vec4 foliageColor = texture2D(uTexture, foliageUv);

      // Subtle sunlight glint as leaves catch morning rays in the wind
      float leafGlint = sin(baseUv.x * 40.0 + baseUv.y * 30.0 + uTime * 3.2) * 0.03 * foliageMask;
      foliageColor.rgb += vec3(leafGlint);

      gl_FragColor = foliageColor;
      return;
    }

    // --- SOLID ROCKS, WOOD DECK, LANTERN, SKY (100% STATIC & ROCK-SOLID) ---
    gl_FragColor = baseColor;
  }
`;

const SeamlessWaterBackground = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext('webgl', {
      alpha: false,
      depth: false,
      antialias: true,
      powerPreference: 'high-performance'
    });

    if (!gl) return;

    // Compile Shader Helper
    const createShader = (gl, type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Full-screen Quad Geometry (-1 to +1)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1
      ]),
      gl.STATIC_DRAW
    );

    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    // Uniform Locations
    const uTexture = gl.getUniformLocation(program, 'uTexture');
    const uTime = gl.getUniformLocation(program, 'uTime');
    const uResolution = gl.getUniformLocation(program, 'uResolution');
    const uImageResolution = gl.getUniformLocation(program, 'uImageResolution');

    // Create & Load Texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Placeholder pixel while image loads
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([240, 240, 235, 255]));

    let imgWidth = 1536;
    let imgHeight = 1024;
    let textureLoaded = false;

    const img = new Image();
    img.src = waterfallBg;
    img.onload = () => {
      imgWidth = img.width || 1536;
      imgHeight = img.height || 1024;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      textureLoaded = true;
      handleResize();
    };

    let animationFrameId;
    let isVisible = true;
    const startTime = performance.now();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleResize = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = rect.width;
      const h = rect.height;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);

      gl.useProgram(program);
      gl.uniform2f(uResolution, w, h);
      gl.uniform2f(uImageResolution, imgWidth, imgHeight);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Animation Render Loop
    const render = (currentTime) => {
      animationFrameId = requestAnimationFrame(render);
      if (!isVisible || !textureLoaded) return;

      const elapsed = prefersReducedMotion ? 0 : (currentTime - startTime) * 0.001;

      gl.useProgram(program);
      gl.uniform1f(uTime, elapsed);
      gl.uniform1i(uTexture, 0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      gl.deleteTexture(texture);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0"
      style={{ filter: 'brightness(1.1)' }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
};

export default React.memo(SeamlessWaterBackground);
