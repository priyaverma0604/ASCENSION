import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Search, ShoppingBag, Heart, Trash2, Plus, Minus, CreditCard, Compass, ChevronRight, User, CheckCircle, AlertTriangle, UploadCloud, Smartphone } from 'lucide-react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${apiBase}${path}`;
};

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get('tab') || 'shop'; // 'shop', 'cart', 'wishlist', 'orders'

  const { user } = useContext(AuthContext);
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartCount, getCartTotal } = useContext(CartContext);
  const { wishlist, toggleWishlist, isInWishlist } = useContext(WishlistContext);

  // E-commerce state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('');
  const [myOrders, setMyOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Checkout state
  const [checkoutActive, setCheckoutActive] = useState(false);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [phone, setPhone] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [simulationMode, setSimulationMode] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');

  const categories = [
    'All', 'Bath Salts', 'Healing Camphor', 'Healing Oils', 'Candles'
  ];

  useEffect(() => {
    fetchProducts();
  }, [category, sort]);

  useEffect(() => {
    if (activeTab === 'orders' && user) {
      fetchMyOrders();
    }
  }, [activeTab, user]);

  // Horoscope Customiser state
  const zodiacs = [
    { name: "Aries", dates: "Mar 21 - Apr 19", element: "Fire", planet: "Mars", crystals: ["Carnelian", "Jasper", "Amethyst"], desc: "As a bold and energetic Fire sign, you thrive with grounding stones that harness your passion while maintaining inner calm. Carnelian fuels your motivation, Red Jasper grounds your energy, and Amethyst connects you to higher guidance." },
    { name: "Taurus", dates: "Apr 20 - May 20", element: "Earth", planet: "Venus", crystals: ["Rose Quartz", "Selenite", "Clear Quartz"], desc: "Governed by Venus, you seek beauty, stability, and comfort. Rose Quartz opens your heart to love and abundance, Selenite purifies your energy field, and Clear Quartz amplifies your inner strength." },
    { name: "Gemini", dates: "May 21 - Jun 20", element: "Air", planet: "Mercury", crystals: ["Citrine", "Tiger Eye", "Aventurine"], desc: "Expressive and intellectually active, you benefit from crystals that bring clarity and focus. Citrine channels optimism, Tiger Eye balances duality with confidence, and Green Aventurine invites luck and mental ease." },
    { name: "Cancer", dates: "Jun 21 - Jul 22", element: "Water", planet: "Moon", crystals: ["Moonstone", "Rose Quartz", "Obsidian"], desc: "Deeply intuitive and emotional, you need protective, soothing stones. Moonstone enhances your natural psychic intuition, Rose Quartz nurtures self-care, and Black Obsidian shields your sensitive energy." },
    { name: "Leo", dates: "Jul 23 - Aug 22", element: "Fire", planet: "Sun", crystals: ["Tiger Eye", "Citrine", "Carnelian"], desc: "Radiant, brave, and creative, you align with sun-drenched stones. Tiger Eye boosts your personal courage, Citrine mirrors your golden warmth, and Carnelian inspires bold creative projects." },
    { name: "Virgo", dates: "Aug 23 - Sep 22", element: "Earth", planet: "Mercury", crystals: ["Aventurine", "Citrine", "Jasper"], desc: "Practical, detailed, and service-oriented, you benefit from stones that quiet a busy mind. Green Aventurine attracts positive energy, Citrine sparks creativity, and Jasper grounds your day-to-day focus." },
    { name: "Libra", dates: "Sep 23 - Oct 22", element: "Air", planet: "Venus", crystals: ["Rose Quartz", "Lapis", "Citrine"], desc: "Seeking harmony, balance, and connection, you vibrate with peaceful stones. Rose Quartz deepens relationship bonds, Lapis Lazuli aids clear communication, and Citrine keeps your spirits bright." },
    { name: "Scorpio", dates: "Oct 23 - Nov 21", element: "Water", planet: "Pluto", crystals: ["Obsidian", "Hematite", "Amethyst"], desc: "Intense, transformative, and magnetic, you align with deep protective crystals. Obsidian helps you release old emotional blockages, Hematite grounds your focus, and Amethyst channels spiritual peace." },
    { name: "Sagittarius", dates: "Nov 22 - Dec 21", element: "Fire", planet: "Jupiter", crystals: ["Amethyst", "Turquoise", "Sodalite"], desc: "Adventurous, philosophical, and optimistic, you thrive with wisdom-enhancing stones. Amethyst deepens your spiritual studies, Turquoise guards your travels, and Sodalite clarifies your ideas." },
    { name: "Capricorn", dates: "Dec 22 - Jan 19", element: "Earth", planet: "Saturn", crystals: ["Onyx", "Tiger Eye", "Fluorite"], desc: "Ambitious, structured, and disciplined, you match with strong grounding stones. Black Onyx protects your focus, Tiger Eye inspires confidence, and Rainbow Fluorite structure-organizes thoughts." },
    { name: "Aquarius", dates: "Jan 20 - Feb 18", element: "Air", planet: "Uranus", crystals: ["Amethyst", "Fluorite", "Selenite"], desc: "Visionary, independent, and humanitarian, you connect with high-frequency crystals. Amethyst elevates your intuitive vision, Fluorite organizes ideas, and Selenite sweeps away static energy." },
    { name: "Pisces", dates: "Feb 19 - Mar 20", element: "Water", planet: "Neptune", crystals: ["Amethyst", "Moonstone", "Rose Quartz"], desc: "Imaginative, empathetic, and spiritual, you align with soft angelic crystals. Amethyst deepens dream connection, Moonstone mirrors emotional tides, and Rose Quartz envelopes you in universal compassion." }
  ];

  const [selectedZodiac, setSelectedZodiac] = useState(zodiacs[0]);
  const [allProductsForCustomise, setAllProductsForCustomise] = useState([]);
  const [loadingCustomise, setLoadingCustomise] = useState(false);

  useEffect(() => {
    if (activeTab === 'customise') {
      fetchAllProductsForCustomise();
    }
  }, [activeTab]);

  const fetchAllProductsForCustomise = async () => {
    setLoadingCustomise(true);
    try {
      const { data } = await axios.get('/api/products', {
        params: { category: 'All' }
      });
      if (data.success) {
        setAllProductsForCustomise(data.data);
      }
    } catch (err) {
      console.error('Error loading customize products:', err);
    } finally {
      setLoadingCustomise(false);
    }
  };

  const getRecommendedProducts = () => {
    if (!selectedZodiac) return [];
    return allProductsForCustomise.filter(product => {
      return selectedZodiac.crystals.some(crystal => {
        const titleMatch = product.name?.toLowerCase().includes(crystal.toLowerCase());
        const descMatch = product.description?.toLowerCase().includes(crystal.toLowerCase());
        return titleMatch || descMatch;
      });
    });
  };

  // Horoscope Upload Form State
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [custName, setCustName] = useState(user ? user.name : '');
  const [custContact, setCustContact] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileBase64, setFileBase64] = useState('');
  const [uploadSubmitting, setUploadSubmitting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setUploadSubmitting(true);
    try {
      const payload = {
        name: custName,
        email: user ? user.email : 'horoscope@custom.com',
        phone: custContact,
        message: `[HOROSCOPE BRACELET CUSTOMIZATION REQUEST]
Name: ${custName}
WhatsApp/Contact: ${custContact}
Birth Date: ${birthDate}
Birth Time: ${birthTime}
Birth Place: ${birthPlace}
Attached Chart File: ${selectedFile ? selectedFile.name : 'None'}
Chart Base64 Length: ${fileBase64 ? fileBase64.length : 0}`
      };
      
      const { data } = await axios.post('/api/contacts', payload);
      if (data.success) {
        setUploadSuccess(true);
        setBirthDate('');
        setBirthTime('');
        setBirthPlace('');
        setCustContact('');
        setSelectedFile(null);
        setFileBase64('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit customization request. Please try again.');
    } finally {
      setUploadSubmitting(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/products', {
        params: {
          category,
          sort,
          search
        }
      });
      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error('Error fetching products:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyOrders = async () => {
    setLoadingOrders(true);
    try {
      const { data } = await axios.get('/api/orders/myorders');
      if (data.success) {
        setMyOrders(data.data);
      }
    } catch (err) {
      console.error('Error fetching user orders:', err.message);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    setSearchParams({ category: cat, tab: 'shop' });
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please register/login to complete purchase checkout.');
      navigate('/login');
      return;
    }
    if (!transactionId || !screenshot) {
      alert('Please enter your transaction Reference ID and upload the receipt screenshot.');
      return;
    }
    setCheckoutLoading(true);

    try {
      const formData = new FormData();
      formData.append('items', JSON.stringify(cart.map(item => ({ product: item.product._id, quantity: item.quantity }))));
      formData.append('shippingAddress', JSON.stringify({
        address,
        city,
        state: stateName,
        postalCode,
        country,
        phone
      }));
      formData.append('transactionId', transactionId);
      formData.append('paymentScreenshot', screenshot);

      const { data } = await axios.post('/api/orders', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (data.success) {
        clearCart();
        setCheckoutSuccess(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-cream-dark/60 gap-4 overflow-x-auto pb-1.5 scrollbar-thin">
          <button
            onClick={() => setSearchParams({ tab: 'shop' })}
            className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-all ${
              activeTab === 'shop' ? 'border-gold text-gold' : 'border-transparent text-charcoal/60'
            }`}
          >
            Shop Crystals
          </button>
          <button
            onClick={() => setSearchParams({ tab: 'customise' })}
            className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'customise' ? 'border-gold text-gold' : 'border-transparent text-charcoal/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Horoscope Customiser</span>
          </button>
          <button
            onClick={() => setSearchParams({ tab: 'cart' })}
            className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'cart' ? 'border-gold text-gold' : 'border-transparent text-charcoal/60'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>My Cart ({getCartCount()})</span>
          </button>
          <button
            onClick={() => setSearchParams({ tab: 'wishlist' })}
            className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'wishlist' ? 'border-gold text-gold' : 'border-transparent text-charcoal/60'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Wishlist ({wishlist.length})</span>
          </button>
          {user && (
            <button
              onClick={() => setSearchParams({ tab: 'orders' })}
              className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-all ${
                activeTab === 'orders' ? 'border-gold text-gold' : 'border-transparent text-charcoal/60'
              }`}
            >
              Order History
            </button>
          )}
        </div>

        {/* Tab 1: Product Shop Listing */}
        {activeTab === 'shop' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Left Sidebar Filters */}
            <div className="flex flex-col gap-6 text-left">
              <div>
                <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-charcoal-dark mb-4">
                  Categories
                </h4>
                <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-thin">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      className={`text-xs text-left px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                        category === cat
                          ? 'bg-sage text-white font-bold'
                          : 'bg-cream/50 text-charcoal-light hover:bg-cream-dark'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Products Container */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              
              {/* Search & Sort Panel */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-xs">
                  <input
                    type="text"
                    placeholder="Search spiritual products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2 px-3.5 pl-9 text-xs text-charcoal focus:outline-none focus:border-sage transition-all"
                  />
                  <Search className="w-4 h-4 text-charcoal/50 absolute left-3 top-2.5" />
                </form>
                <div className="flex gap-2 w-full sm:w-auto font-sans text-xs">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="bg-cream-light border border-cream-dark/60 rounded-xl py-2 px-3 focus:outline-none focus:border-sage w-full sm:w-auto"
                  >
                    <option value="">Sort Products</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest Additions</option>
                  </select>
                </div>
              </div>

              {/* Product Grid */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[1, 2, 3].map(n => (
                    <div key={n} className="shimmer h-72 rounded-2xl w-full"></div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product._id} className="glass rounded-2xl overflow-hidden flex flex-col p-4 shadow-sm hover:shadow-md transition-all duration-300 relative border border-cream-dark/40 group">
                      
                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(product)}
                        className={`absolute top-6 right-6 z-10 p-1.5 rounded-full border shadow-sm transition-all focus:outline-none ${
                          isInWishlist(product._id)
                            ? 'bg-lavender text-charcoal-dark border-lavender-dark'
                            : 'bg-white/80 text-charcoal border-cream-dark'
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                      </button>

                      <Link to={`/product/${product._id}`} className="h-44 bg-cream rounded-xl overflow-hidden relative mb-4 block">
                        <img 
                          src={product.images && product.images[0] ? getImageUrl(product.images[0]) : "https://images.unsplash.com/photo-1615627121117-e3278bc8b1db?auto=format&fit=crop&w=400&q=80"} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                        />
                      </Link>
                      
                      <div className="flex flex-col text-left gap-1 flex-1">
                        <span className="text-[9px] uppercase tracking-widest text-sage font-bold font-sans">
                          {product.category}
                        </span>
                        <Link to={`/product/${product._id}`}>
                          <h3 className="font-serif text-sm font-bold text-charcoal-dark leading-snug line-clamp-1 hover:text-gold transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-[11px] text-charcoal-light font-sans line-clamp-2 leading-relaxed flex-1">
                          {product.description}
                        </p>
                        <div className="flex justify-between items-center border-t border-cream-dark/50 pt-3 mt-3 font-sans text-xs">
                          <span className="font-serif font-bold text-gold-dark">₹{product.pricing}</span>
                          <button
                            onClick={() => addToCart(product)}
                            className="bg-sage hover:bg-sage-dark text-white font-bold py-1.5 px-3 rounded-lg transition-colors text-[10px] uppercase tracking-wider"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center glass rounded-2xl">
                  <p className="text-xs text-charcoal-light">No products found in this category.</p>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Tab 5: Horoscope Customiser */}
        {activeTab === 'customise' && (
          <div className="flex flex-col gap-10 text-left animate-fade-in">
            {/* Header description */}
            <div className="glass p-6 md:p-8 rounded-2xl border border-cream-dark/50 flex flex-col gap-3">
              <span className="font-sans text-[10px] sm:text-xs text-gold-dark tracking-[0.25em] font-bold uppercase">Customised Recommendations</span>
              <h2 className="font-serif text-2xl font-bold text-charcoal-dark">Find Your Lucky Crystal Tool</h2>
              <p className="text-xs text-charcoal-light leading-relaxed font-sans max-w-2xl">
                Every horoscope sign vibrates at a unique energy frequency. Select your zodiac sign below to discover which therapeutic crystals, protective stones, or energetic bracelets are best suited to balance your body, mind, and spirit.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Left Column: 12 Zodiac signs selector */}
              <div className="lg:col-span-1 flex flex-col gap-4">
                <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-charcoal-dark border-b border-cream-dark/50 pb-2">
                  Select Your Zodiac
                </h4>
                <div className="grid grid-cols-2 xs:grid-cols-3 lg:grid-cols-2 gap-3">
                  {zodiacs.map((z) => (
                    <button
                      key={z.name}
                      onClick={() => setSelectedZodiac(z)}
                      className={`glass p-4 rounded-xl flex flex-col items-center text-center gap-1.5 transition-all duration-300 ${
                        selectedZodiac.name === z.name 
                          ? 'border-gold bg-gold/10 shadow-md transform scale-[1.02]' 
                          : 'border-cream-dark/30 hover:border-gold/30 hover:bg-cream-light/35'
                      }`}
                    >
                      <span className="text-xs font-bold text-charcoal-dark font-serif">{z.name}</span>
                      <span className="text-[9px] text-charcoal-light font-sans">{z.dates}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Custom guidance and matching shop products */}
              <div className="lg:col-span-2 flex flex-col gap-8">
                {/* Details panel */}
                <div className="glass p-6 md:p-8 rounded-[24px] border border-cream-dark/65 flex flex-col gap-5 shadow-sm relative overflow-hidden bg-white/70">
                  <div className="flex flex-wrap justify-between items-center gap-4 border-b border-cream-dark/65 pb-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-gold-dark uppercase tracking-wider font-bold">Zodiac Sign Profile</span>
                      <h3 className="font-serif text-xl font-bold text-charcoal-dark">{selectedZodiac.name}</h3>
                    </div>
                    <div className="flex gap-3 text-[10px] uppercase font-bold tracking-wider text-charcoal-light">
                      <span className="bg-cream/60 p-1.5 px-3 rounded-lg border border-cream-dark/35">Element: <strong className="text-charcoal-dark">{selectedZodiac.element}</strong></span>
                      <span className="bg-cream/60 p-1.5 px-3 rounded-lg border border-cream-dark/35">Ruling Planet: <strong className="text-charcoal-dark">{selectedZodiac.planet}</strong></span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <h5 className="font-serif text-xs uppercase tracking-wider text-charcoal-dark font-bold">Energy Balancing Guidance:</h5>
                    <p className="text-xs text-charcoal-light leading-relaxed font-sans">
                      {selectedZodiac.desc}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <h5 className="font-serif text-xs uppercase tracking-wider text-charcoal-dark font-bold">Lucky Stones & Crystals:</h5>
                    <div className="flex gap-2 flex-wrap">
                      {selectedZodiac.crystals.map((c, idx) => (
                        <span key={idx} className="bg-gold/15 text-gold-dark text-[10px] font-bold tracking-wide uppercase px-3 py-1 rounded-full border border-gold/20">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Upload Horoscope Form */}
                <div className="glass p-6 md:p-8 rounded-[24px] border border-cream-dark/65 flex flex-col gap-6 shadow-sm bg-white/70">
                  <div className="flex flex-col gap-1 border-b border-cream-dark/50 pb-3 text-left">
                    <span className="text-[10px] text-gold-dark uppercase tracking-wider font-bold">Personalised Astrological Alignment</span>
                    <h3 className="font-serif text-lg font-bold text-charcoal-dark">Upload Birth Chart for Custom Recommendation</h3>
                    <p className="text-[10px] text-charcoal-light leading-relaxed font-sans mt-1">
                      Don't want to choose by zodiac alone? Upload your birth chart (Kundli / Natal chart image) or provide your birth details below. Our manifestation and energy coaches will review your placements to recommend the exact custom bracelets you need.
                    </p>
                  </div>

                  {uploadSuccess ? (
                    <div className="flex flex-col items-center justify-center text-center gap-3 py-6 bg-cream/20 rounded-2xl border border-gold/15 animate-fade-in">
                      <CheckCircle className="w-10 h-10 text-gold animate-bounce" />
                      <h5 className="font-serif text-sm font-bold text-charcoal-dark">Chart Received Successfully!</h5>
                      <p className="text-[10px] text-charcoal-light leading-relaxed max-w-sm">
                        Thank you! Our energy healers will analyze your chart configuration. We will reach out to you on WhatsApp or Email within 24 hours with your custom crystal recommendation report.
                      </p>
                      <button
                        onClick={() => setUploadSuccess(false)}
                        className="bg-gold hover:bg-gold-dark text-charcoal-dark font-bold text-[9px] uppercase tracking-wider py-2 px-6 rounded-lg mt-2 transition-colors"
                      >
                        Upload Another Chart
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleUploadSubmit} className="flex flex-col gap-4 font-sans text-xs text-charcoal text-left">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="font-bold text-charcoal-light uppercase tracking-wider text-[9px]">Your Name</label>
                          <input
                            type="text"
                            required
                            placeholder="Enter your name"
                            value={custName}
                            onChange={(e) => setCustName(e.target.value)}
                            className="bg-cream-light/60 border border-cream-dark rounded-xl py-2.5 px-3 focus:outline-none focus:border-gold transition-colors text-xs"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="font-bold text-charcoal-light uppercase tracking-wider text-[9px]">WhatsApp / Contact</label>
                          <input
                            type="tel"
                            required
                            placeholder="10-digit number"
                            value={custContact}
                            onChange={(e) => setCustContact(e.target.value)}
                            className="bg-cream-light/60 border border-cream-dark rounded-xl py-2.5 px-3 focus:outline-none focus:border-gold transition-colors text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="font-bold text-charcoal-light uppercase tracking-wider text-[9px]">Birth Date</label>
                          <input
                            type="date"
                            required
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="bg-cream-light/60 border border-cream-dark rounded-xl py-2.5 px-3 focus:outline-none focus:border-gold transition-colors text-xs"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="font-bold text-charcoal-light uppercase tracking-wider text-[9px]">Birth Time</label>
                          <input
                            type="time"
                            required
                            value={birthTime}
                            onChange={(e) => setBirthTime(e.target.value)}
                            className="bg-cream-light/60 border border-cream-dark rounded-xl py-2.5 px-3 focus:outline-none focus:border-gold transition-colors text-xs"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="font-bold text-charcoal-light uppercase tracking-wider text-[9px]">Birth Place</label>
                          <input
                            type="text"
                            required
                            placeholder="City, State"
                            value={birthPlace}
                            onChange={(e) => setBirthPlace(e.target.value)}
                            className="bg-cream-light/60 border border-cream-dark rounded-xl py-2.5 px-3 focus:outline-none focus:border-gold transition-colors text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-charcoal-light uppercase tracking-wider text-[9px]">Upload Birth Chart (Kundli / Natal Chart)</label>
                        <div className="border border-dashed border-cream-dark/80 rounded-xl p-4 bg-cream-light/30 flex flex-col items-center gap-2 text-center cursor-pointer hover:bg-cream-light/60 transition-colors relative">
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <UploadCloud className="w-6 h-6 text-gold-dark" />
                          <span className="text-[10px] text-charcoal-light font-medium">
                            {selectedFile ? `Selected: ${selectedFile.name}` : "Click or drag files here (PNG, JPG, PDF)"}
                          </span>
                          {selectedFile && (
                            <span className="text-[8px] text-sage">
                              File size: {(selectedFile.size / 1024).toFixed(1)} KB
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={uploadSubmitting}
                        className="w-full bg-gold hover:bg-gold-dark text-charcoal-dark font-bold py-2.5 rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center gap-1.5 uppercase tracking-wider disabled:opacity-50 text-[10px]"
                      >
                        {uploadSubmitting ? 'Uploading details...' : 'Submit Horoscope Request'}
                      </button>
                    </form>
                  )}
                </div>

                {/* Live Recommended Products list */}
                <div className="flex flex-col gap-4">
                  <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-charcoal-dark border-b border-cream-dark/50 pb-2">
                    Recommended Shop Items
                  </h4>
                  {loadingCustomise ? (
                    <div className="py-12 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto"></div>
                      <p className="text-xs text-charcoal-light mt-3">Scanning active inventory...</p>
                    </div>
                  ) : getRecommendedProducts().length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {getRecommendedProducts().map((product) => (
                        <div key={product._id} className="glass rounded-2xl overflow-hidden border border-cream-dark/45 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full bg-white/70">
                          {/* Image container */}
                          <Link to={`/product/${product._id}`} className="relative h-44 w-full bg-cream overflow-hidden block">
                            <img 
                              src={product.images && product.images[0] ? getImageUrl(product.images[0]) : ""} 
                              alt={product.name} 
                              className="w-full h-full object-cover transform hover:scale-[1.02] transition-transform duration-300"
                            />
                            <span className="absolute top-3 left-3 bg-white/95 text-gold-dark text-[9px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-full border border-cream-dark/50 shadow-xs">
                              {product.category}
                            </span>
                          </Link>

                          {/* Info */}
                          <div className="p-4 flex flex-col flex-grow gap-2.5 text-left">
                            <Link to={`/product/${product._id}`} className="font-serif text-xs sm:text-sm font-bold text-charcoal-dark hover:text-gold transition-colors line-clamp-1 block">
                              {product.name}
                            </Link>
                            <p className="text-[10px] text-charcoal-light leading-normal line-clamp-2 font-sans flex-grow">
                              {product.description}
                            </p>
                            <div className="flex items-center justify-between border-t border-cream-dark/35 pt-2.5 mt-auto">
                              <span className="font-serif font-bold text-gold-dark text-xs sm:text-sm">₹{product.pricing}</span>
                              
                              <button
                                onClick={() => {
                                  addToCart(product);
                                  alert(`${product.name} added to cart!`);
                                }}
                                className="bg-gold hover:bg-gold-dark text-charcoal-dark font-bold text-[9px] uppercase tracking-wider py-1.5 px-3 rounded-lg shadow-xs transition-all duration-300"
                              >
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center glass rounded-2xl">
                      <p className="text-xs text-charcoal-light">No crystals or bracelets currently in stock match these specific zodiac stones. Please check other items or contact our support.</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Cart & Checkout */}
        {activeTab === 'cart' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
            
            {/* Cart Items list */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <h3 className="font-serif text-lg font-bold text-charcoal-dark uppercase tracking-wider">
                Shopping Cart
              </h3>
              
              {checkoutSuccess ? (
                /* Checkout Success Banner */
                <div className="glass p-8 rounded-2xl flex flex-col items-center justify-center text-center gap-4 border border-sage/40">
                  <CheckCircle className="w-12 h-12 text-sage animate-pulse-subtle" />
                  <h4 className="font-serif text-lg font-bold text-charcoal-dark">
                    Order Placed Successfully!
                  </h4>
                  <p className="text-xs text-charcoal-light leading-relaxed max-w-md">
                    Thank you for your purchase! Your manual payment checkout request has been logged successfully. Once our team verifies your receipt screenshot, we will confirm the order and dispatch your spiritual items. You can view progress in your Order History.
                  </p>
                  <button
                    onClick={() => {
                      setCheckoutSuccess(false);
                      setSearchParams({ tab: 'orders' });
                    }}
                    className="bg-sage hover:bg-sage-dark text-white text-xs font-bold py-2.5 px-8 rounded-xl shadow-sm transition-all duration-300 mt-2 font-sans"
                  >
                    View My Orders
                  </button>
                </div>
              ) : cart.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {cart.map((item) => (
                    <div key={item.product._id} className="glass p-4 rounded-xl flex items-center justify-between gap-4 border border-cream-dark/40 font-sans text-xs text-charcoal">
                      <div className="w-14 h-14 rounded-lg bg-cream overflow-hidden shrink-0">
                        <img 
                          src={item.product.images && item.product.images[0] ? getImageUrl(item.product.images[0]) : ""} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-bold text-charcoal-dark truncate">{item.product.name}</h4>
                        <p className="text-[10px] text-sage">{item.product.category}</p>
                        <p className="font-semibold text-gold-dark mt-0.5">₹{item.product.pricing}</p>
                      </div>
                      
                      {/* Quantities */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="p-1 rounded-md bg-cream hover:bg-cream-dark focus:outline-none"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="p-1 rounded-md bg-cream hover:bg-cream-dark focus:outline-none"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="p-1.5 text-red-500 hover:text-red-700 transition-colors focus:outline-none"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center glass rounded-2xl">
                  <p className="text-xs text-charcoal-light">Your shopping cart is currently empty.</p>
                  <button
                    onClick={() => setSearchParams({ tab: 'shop' })}
                    className="text-xs font-bold text-sage hover:text-gold uppercase tracking-wider mt-4"
                  >
                    Go Back Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Cart Summary & Checkout Form */}
            {cart.length > 0 && !checkoutSuccess && (
              <div className="flex flex-col gap-6">
                
                {/* Checkout Summary Box */}
                <div className="glass p-5 rounded-2xl border border-cream-dark/50 flex flex-col gap-4 text-xs font-sans text-charcoal">
                  <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-charcoal-dark border-b border-cream-dark pb-2">
                    Order Summary
                  </h4>
                  <div className="flex justify-between items-center text-charcoal-light">
                    <span>Total Items</span>
                    <span className="font-bold">{getCartCount()}</span>
                  </div>
                  <div className="flex justify-between items-center text-charcoal-light border-b border-cream-dark pb-3">
                    <span>Shipping</span>
                    <span className="text-sage font-semibold uppercase">Free Shipping</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-medium">Order Total</span>
                    <span className="font-serif font-bold text-gold-dark text-base">₹{getCartTotal()}</span>
                  </div>

                  {!checkoutActive && (
                    <button
                      onClick={() => setCheckoutActive(true)}
                      className="w-full bg-sage hover:bg-sage-dark text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-sm text-center uppercase tracking-wider flex items-center justify-center gap-2 mt-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Proceed to Checkout</span>
                    </button>
                  )}
                </div>

                {/* Checkout Fields (Active Mode) */}
                {checkoutActive && (
                  <form onSubmit={handleCheckoutSubmit} className="glass p-5 rounded-2xl border border-cream-dark/50 flex flex-col gap-3 font-sans text-xs text-charcoal animate-slide-up">
                    <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-charcoal-dark border-b border-cream-dark pb-2 mb-2">
                      Shipping Details
                    </h4>

                      /* Shipping Address & UPI Payment Form */
                      <div className="flex flex-col gap-3 text-left">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-charcoal-light uppercase">Street Address</label>
                          <input
                            type="text"
                            required
                            placeholder="Door No, Street name"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="bg-cream-light border border-cream-dark/60 rounded-xl py-2 px-3 text-charcoal focus:outline-none focus:border-sage transition-all"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-charcoal-light uppercase">City</label>
                            <input
                              type="text"
                              required
                              placeholder="New Delhi"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              className="bg-cream-light border border-cream-dark/60 rounded-xl py-2 px-3 text-charcoal focus:outline-none focus:border-sage transition-all"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-charcoal-light uppercase">State</label>
                            <input
                              type="text"
                              required
                              placeholder="Delhi"
                              value={stateName}
                              onChange={(e) => setStateName(e.target.value)}
                              className="bg-cream-light border border-cream-dark/60 rounded-xl py-2 px-3 text-charcoal focus:outline-none focus:border-sage transition-all"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-charcoal-light uppercase">Postal Code</label>
                            <input
                              type="text"
                              required
                              placeholder="110016"
                              value={postalCode}
                              onChange={(e) => setPostalCode(e.target.value)}
                              className="bg-cream-light border border-cream-dark/60 rounded-xl py-2 px-3 text-charcoal focus:outline-none focus:border-sage transition-all"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-charcoal-light uppercase">Country</label>
                            <input
                              type="text"
                              required
                              placeholder="India"
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                              className="bg-cream-light border border-cream-dark/60 rounded-xl py-2 px-3 text-charcoal focus:outline-none"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-charcoal-light uppercase">Phone Number</label>
                          <input
                            type="tel"
                            required
                            placeholder="10-digit phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="bg-cream-light border border-cream-dark/60 rounded-xl py-2 px-3 text-charcoal focus:outline-none focus:border-sage transition-all"
                          />
                        </div>

                        {/* UPI QR Details */}
                        <div className="bg-cream/60 border border-cream-dark/60 p-3 rounded-xl flex gap-3 text-charcoal-light font-sans leading-relaxed text-left mt-2">
                          <Smartphone className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold uppercase tracking-wider text-[8px] text-charcoal-dark">Scan & Pay via UPI</p>
                            <p className="text-[9px] mt-0.5">
                              Scan the QR below or pay using UPI ID: <strong className="text-charcoal-dark">sonalibhasinkumar@ptaxis</strong>. 
                              Upload the receipt screenshot and transaction ID to submit order.
                            </p>
                          </div>
                        </div>

                        {/* QR Image */}
                        <div className="flex justify-center py-2 bg-white/40 rounded-xl border border-cream-dark/40 max-w-[150px] mx-auto">
                          <img 
                            src={getImageUrl('/uploads/default_upi_qr.jpg')} 
                            alt="Payment QR Code" 
                            className="w-32 h-32 object-contain"
                          />
                        </div>

                        {/* Transaction ID */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-charcoal-light uppercase">Transaction Reference ID</label>
                          <input
                            type="text"
                            required
                            placeholder="Enter 12-digit transaction ID"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            className="bg-cream-light border border-cream-dark/60 rounded-xl py-2 px-3 text-charcoal focus:outline-none focus:border-sage transition-all"
                          />
                        </div>

                        {/* Screenshot upload */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-charcoal-light uppercase">Upload Payment Screenshot</label>
                          <div className="flex items-center gap-3">
                            <label className="flex-1 flex flex-col items-center justify-center border border-dashed border-cream-dark/60 rounded-xl py-2 px-3 bg-cream-light hover:bg-cream cursor-pointer transition-colors duration-200">
                              <UploadCloud className="w-4 h-4 text-gold-dark mb-1" />
                              <span className="text-[9px] text-charcoal-light">
                                {screenshot ? screenshot.name : 'Choose receipt image'}
                              </span>
                              <input 
                                type="file"
                                required
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    setScreenshot(file);
                                    setScreenshotPreview(URL.createObjectURL(file));
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                            {screenshotPreview && (
                              <div className="w-10 h-10 rounded-lg overflow-hidden border border-cream-dark shrink-0">
                                <img src={screenshotPreview} alt="Receipt preview" className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={checkoutLoading}
                          className="w-full bg-gold hover:bg-gold-dark text-charcoal-dark border border-gold-dark/20 font-bold py-3 rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center gap-2 mt-2 uppercase tracking-wider text-[10px]"
                        >
                          {checkoutLoading && <Compass className="w-4 h-4 animate-spin text-charcoal-dark" />}
                          <span>{checkoutLoading ? 'Submitting...' : 'Submit Order Receipt'}</span>
                        </button>
                      </div>
                  </form>
                )}

              </div>
            )}
          </div>
        )}

        {/* Tab 3: Wishlist */}
        {activeTab === 'wishlist' && (
          <div className="flex flex-col gap-4 text-left">
            <h3 className="font-serif text-lg font-bold text-charcoal-dark uppercase tracking-wider">
              My Wishlist
            </h3>
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                {wishlist.map((product) => (
                  <div key={product._id} className="glass rounded-2xl overflow-hidden flex flex-col p-4 shadow-sm border border-cream-dark/40 relative">
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-6 right-6 z-10 p-1.5 rounded-full bg-lavender text-charcoal-dark border border-lavender-dark shadow-sm"
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <div className="h-40 bg-cream rounded-xl overflow-hidden mb-3">
                      <img src={product.images && product.images[0] ? getImageUrl(product.images[0]) : ""} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col text-left gap-1 flex-1 font-sans text-xs">
                      <span className="text-[9px] uppercase tracking-widest text-sage font-bold">{product.category}</span>
                      <h4 className="font-serif font-bold text-charcoal-dark truncate">{product.name}</h4>
                      <p className="font-bold text-gold-dark mt-1">₹{product.pricing}</p>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-sage hover:bg-sage-dark text-white font-bold py-2 rounded-xl transition-colors text-[10px] uppercase tracking-wider mt-3"
                      >
                        Move to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center glass rounded-2xl">
                <p className="text-xs text-charcoal-light">Your wishlist is currently empty.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Order History */}
        {activeTab === 'orders' && (
          <div className="flex flex-col gap-6 text-left">
            <h3 className="font-serif text-lg font-bold text-charcoal-dark uppercase tracking-wider">
              Order History
            </h3>
            
            {loadingOrders ? (
              <div className="shimmer h-40 rounded-2xl"></div>
            ) : myOrders.length > 0 ? (
              <div className="flex flex-col gap-5">
                {myOrders.map((order) => (
                  <div key={order._id} className="glass p-5 rounded-2xl border border-cream-dark/50 flex flex-col gap-4 font-sans text-xs text-charcoal">
                    <div className="flex flex-wrap justify-between items-center gap-3 border-b border-cream-dark/65 pb-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-charcoal-light uppercase">Order ID</span>
                        <span className="font-mono font-bold text-charcoal-dark truncate">{order.orderId}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-charcoal-light uppercase">Date Placed</span>
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-charcoal-light uppercase">Total Amount</span>
                        <span className="font-serif font-bold text-gold-dark">₹{order.totalAmount}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          order.paymentStatus === 'paid' ? 'bg-sage/10 text-sage' : 'bg-red-500/10 text-red-600'
                        }`}>
                          Payment: {order.paymentStatus}
                        </span>
                        <span className="bg-cream-dark/50 text-charcoal-light px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">
                          Status: {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Order Items list */}
                    <div className="flex flex-col gap-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center gap-4">
                          <div className="flex items-center gap-2">
                            {item.product && (
                              <div className="w-10 h-10 rounded bg-cream overflow-hidden shrink-0">
                                <img src={item.product.images?.[0] || ""} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-charcoal-dark">{item.product?.name || item.name}</p>
                              <p className="text-[10px] text-charcoal-light">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <span className="font-semibold text-charcoal-light">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center glass rounded-2xl">
                <p className="text-xs text-charcoal-light">You have not placed any orders yet.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Shop;
