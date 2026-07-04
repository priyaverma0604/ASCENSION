import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Search, ShoppingBag, Heart, Trash2, Plus, Minus, CreditCard, Compass, ChevronRight, User, CheckCircle, AlertTriangle } from 'lucide-react';
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

  const categories = [
    'All', 'Crystals', 'Lamps', 'Candles', 'Crystal Trees', 'Pendants',
    'Bracelets', 'Healing Stones', 'Selenite Products', 'Trays',
    'Decorative Pieces', 'Wax Melts', 'Bath Salts', 'Healing Oils',
    'Healing Camphor', 'Wax Tablets', 'Sage Leaves'
  ];

  useEffect(() => {
    fetchProducts();
  }, [category, sort]);

  useEffect(() => {
    if (activeTab === 'orders' && user) {
      fetchMyOrders();
    }
  }, [activeTab, user]);

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
    setCheckoutLoading(true);

    try {
      const payload = {
        items: cart.map(item => ({ product: item.product._id, quantity: item.quantity })),
        shippingAddress: {
          address,
          city,
          state: stateName,
          postalCode,
          country,
          phone
        }
      };

      const { data } = await axios.post('/api/orders', payload);
      setOrderDetails(data.data);

      if (data.data.orderId.startsWith('mock_order_')) {
        setSimulationMode(true);
        setCheckoutLoading(false);
      } else {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          alert('Failed to load Razorpay SDK');
          setCheckoutLoading(false);
          return;
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_ascensionKeyId123',
          amount: data.data.amount,
          currency: data.data.currency,
          name: 'Ascension by Sonali',
          description: 'Spiritual Products Purchase',
          order_id: data.data.orderId,
          handler: async (response) => {
            setCheckoutLoading(true);
            try {
              const verifyPayload = {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              };
              const verification = await axios.post('/api/orders/verify', verifyPayload);
              if (verification.data.success) {
                clearCart();
                setCheckoutSuccess(true);
              }
            } catch (verifyErr) {
              alert(verifyErr.response?.data?.message || 'Payment validation failed');
            } finally {
              setCheckoutLoading(false);
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: phone
          },
          theme: { color: '#D4AF37' }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        setCheckoutLoading(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
      setCheckoutLoading(false);
    }
  };

  const handleSimulatePayment = async () => {
    setCheckoutLoading(true);
    try {
      const verifyPayload = {
        razorpay_payment_id: `sim_pay_${Math.random().toString(36).substring(7)}`,
        razorpay_order_id: orderDetails.orderId,
        razorpay_signature: 'simulated_signature'
      };

      const { data } = await axios.post('/api/orders/verify', verifyPayload);
      if (data.success) {
        clearCart();
        setCheckoutSuccess(true);
        setSimulationMode(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Simulation verification failed');
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
                    Thank you for your purchase! Your order is being processed, and we will dispatch your spiritual items shortly. An email confirmation has been sent to your address.
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

                    {simulationMode ? (
                      /* Simulation Pay Trigger */
                      <div className="flex flex-col gap-4 text-center items-center py-2">
                        <div className="bg-lavender-light/40 border border-lavender p-3.5 rounded-xl flex gap-2 text-left">
                          <AlertTriangle className="w-5 h-5 text-lavender-dark shrink-0 mt-0.5" />
                          <span className="leading-relaxed">
                            No credentials config detected. Complete mock checkout verification simulation below.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleSimulatePayment}
                          disabled={checkoutLoading}
                          className="w-full bg-sage hover:bg-sage-dark text-white font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center"
                        >
                          {checkoutLoading ? 'Processing...' : 'Confirm Simulation checkout'}
                        </button>
                      </div>
                    ) : (
                      /* Shipping Address Form */
                      <div className="flex flex-col gap-3">
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
                        <button
                          type="submit"
                          disabled={checkoutLoading}
                          className="w-full bg-gold hover:bg-gold-dark text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center gap-2 mt-2"
                        >
                          {checkoutLoading && <Compass className="w-4 h-4 animate-spin" />}
                          <span>{checkoutLoading ? 'Placing Order...' : 'Pay with Razorpay'}</span>
                        </button>
                      </div>
                    )}
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
