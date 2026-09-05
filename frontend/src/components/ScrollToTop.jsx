import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component:
 * Listens to route changes (pathname, search, hash) and automatically scrolls
 * the viewport to the top of the newly loaded page or section.
 * If a hash anchor is provided (e.g. #seva, #contact), smoothly scrolls to that element.
 */
const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // If an anchor hash is provided, attempt to scroll to the target element
    if (hash) {
      const elementId = hash.replace('#', '');
      // Slight delay to allow DOM render
      const timeoutId = setTimeout(() => {
        const element = document.getElementById(elementId) || document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
      }, 50);

      return () => clearTimeout(timeoutId);
    }

    // Otherwise, immediately scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, search, hash]);

  return null;
};

export default ScrollToTop;
