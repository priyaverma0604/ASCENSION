import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, ShoppingBag, Share2, Plus, Minus, 
  ChevronRight, CheckCircle, AlertCircle, Star, MessageSquare 
} from 'lucide-react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${apiBase}${path}`;
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Review states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    fetchProductDetails();
    // Scroll to top on load/change
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      if (data.success) {
        setProduct(data.data);
        if (data.data.images && data.data.images.length > 0) {
          setActiveImage(data.data.images[0]);
        }
        // Fetch related products
        fetchRelatedProducts(data.data.category, data.data._id);
      } else {
        setError('Failed to load product details.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Product details not found.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (category, currentId) => {
    try {
      const { data } = await axios.get('/api/products', {
        params: { category, limit: 4 }
      });
      if (data.success) {
        // Filter out current product
        const filtered = data.data.filter(p => p._id !== currentId).slice(0, 4);
        setRelatedProducts(filtered);
      }
    } catch (err) {
      console.error('Error fetching related products:', err.message);
    }
  };

  const parseDescription = (desc) => {
    if (!desc) return { shortDesc: '', benefits: [], ingredients: '', howToUse: '' };
    
    let shortDesc = '';
    let benefits = [];
    let ingredients = '';
    let howToUse = '';
    
    // Try to split by sections using lookahead
    const sections = desc.split(/\n+(?=Benefits:|Ingredients:|How to Use:)/i);
    shortDesc = sections[0].trim();
    
    sections.forEach(section => {
      const trimmed = section.trim();
      if (trimmed.startsWith('Benefits:')) {
        const lines = trimmed.replace(/^Benefits:\s*/i, '').split('\n');
        benefits = lines.map(line => line.replace(/^-\s*/, '').trim()).filter(Boolean);
      } else if (trimmed.startsWith('Ingredients:')) {
        ingredients = trimmed.replace(/^Ingredients:\s*/i, '').trim();
      } else if (trimmed.startsWith('How to Use:')) {
        howToUse = trimmed.replace(/^How to Use:\s*/i, '').trim();
      }
    });

    if (benefits.length === 0 && !ingredients && !howToUse) {
      shortDesc = desc;
    }
    
    return { shortDesc, benefits, ingredients, howToUse };
  };

  const handleQuantityChange = (type) => {
    if (type === 'inc') {
      setQuantity(prev => prev + 1);
    } else {
      setQuantity(prev => (prev > 1 ? prev - 1 : 1));
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    alert(`${quantity} unit(s) of ${product.name} added to cart.`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    navigate('/shop?tab=cart');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to submit a review.');
      navigate('/login');
      return;
    }
    
    setReviewLoading(true);
    setReviewSuccess('');
    try {
      const { data } = await axios.post(`/api/products/${id}/reviews`, { rating, comment });
      if (data.success) {
        setReviewSuccess('Review submitted successfully!');
        setComment('');
        // Reload details to show review
        setTimeout(fetchProductDetails, 1500);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-cream-light">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sage"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-cream-light gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h3 className="font-serif text-lg font-bold text-charcoal-dark">{error || 'Product not found'}</h3>
        <Link to="/shop" className="bg-sage hover:bg-sage-dark text-white text-xs font-semibold py-2 px-6 rounded-xl uppercase tracking-wider transition-all shadow-sm">
          Back to Shop
        </Link>
      </div>
    );
  }

  const { shortDesc, benefits, ingredients, howToUse } = parseDescription(product.description);
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="min-h-screen py-10 px-4 md:px-8 font-sans bg-cream-light">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-charcoal-light border-b border-cream-dark/30 pb-4">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/shop" className="hover:text-gold transition-colors">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-gold transition-colors">{product.category}</Link>
          <ChevronRight className="w-3.5 h-3.5 text-charcoal/30" />
          <span className="text-charcoal-dark truncate max-w-[150px]">{product.name}</span>
        </nav>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="h-[400px] md:h-[500px] bg-cream rounded-3xl overflow-hidden shadow-sm border border-cream-dark/40 relative">
              <img 
                src={activeImage ? getImageUrl(activeImage) : "https://images.unsplash.com/photo-1615627121117-e3278bc8b1db?auto=format&fit=crop&w=800&q=80"} 
                alt={product.name} 
                className="w-full h-full object-cover transition-all duration-300"
              />
              {isOutOfStock && (
                <div className="absolute inset-0 bg-charcoal/40 backdrop-blur-xs flex items-center justify-center">
                  <span className="bg-red-500 text-white font-bold uppercase tracking-widest text-xs px-4 py-2 rounded-xl">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      activeImage === img ? 'border-gold shadow-sm scale-95' : 'border-cream-dark/50 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={getImageUrl(img)} alt={`${product.name} ${idx+1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Info & Form */}
          <div className="flex flex-col text-left gap-5">
            
            <div className="flex flex-col gap-1 border-b border-cream-dark/40 pb-4">
              <span className="text-[10px] uppercase tracking-widest text-sage font-bold font-sans">
                {product.category}
              </span>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-charcoal-dark leading-tight mt-1">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mt-2">
                <span className="font-serif text-xl font-bold text-gold-dark">
                  {product.pricing > 0 ? `₹${product.pricing}` : 'Price details coming soon'}
                </span>
                
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${
                  isOutOfStock 
                    ? 'bg-red-500/10 text-red-600 border-red-500/20' 
                    : 'bg-sage/10 text-sage border-sage/20'
                }`}>
                  {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                </span>
              </div>
            </div>

            {/* Description & Details Accordions */}
            <div className="flex flex-col gap-4 text-xs leading-relaxed text-charcoal/80">
              <p className="italic border-l-2 border-gold/45 pl-3 text-charcoal-light font-sans">
                {shortDesc}
              </p>

              {/* Benefits */}
              {benefits.length > 0 && (
                <div className="glass p-4.5 rounded-2xl border border-cream-dark/40">
                  <h4 className="font-serif text-charcoal-dark font-bold mb-2 uppercase tracking-wide text-[10px]">Benefits & Properties</h4>
                  <ul className="list-disc list-inside flex flex-col gap-1 text-charcoal/70 pl-1.5">
                    {benefits.map((b, i) => (
                      <li key={i} className="text-left">{b}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ingredients */}
              {ingredients && (
                <div className="glass p-4.5 rounded-2xl border border-cream-dark/40">
                  <h4 className="font-serif text-charcoal-dark font-bold mb-2 uppercase tracking-wide text-[10px]">Ingredients & Crystals</h4>
                  <p className="text-charcoal/70">{ingredients}</p>
                </div>
              )}

              {/* How to Use */}
              {howToUse && (
                <div className="glass p-4.5 rounded-2xl border border-cream-dark/40">
                  <h4 className="font-serif text-charcoal-dark font-bold mb-2 uppercase tracking-wide text-[10px]">How to Use / Ritual</h4>
                  <p className="text-charcoal/70">{howToUse}</p>
                </div>
              )}
            </div>

            {/* Order Controls */}
            {!isOutOfStock && (
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <div className="flex items-center border border-cream-dark/80 rounded-xl bg-cream-light overflow-hidden shrink-0">
                  <button 
                    onClick={() => handleQuantityChange('dec')}
                    className="p-2.5 hover:bg-cream-dark/30 transition-colors text-charcoal"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold w-10 text-center text-xs">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange('inc')}
                    className="p-2.5 hover:bg-cream-dark/30 transition-colors text-charcoal"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button 
                  onClick={handleAddToCart}
                  className="flex-1 min-w-[140px] bg-sage hover:bg-sage-dark text-white font-bold py-3 px-6 rounded-xl transition-all shadow-sm text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button 
                  onClick={handleBuyNow}
                  className="flex-1 min-w-[140px] bg-gold hover:bg-gold-dark text-white font-bold py-3 px-6 rounded-xl transition-all shadow-sm text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <span>Buy Now</span>
                </button>
              </div>
            )}

            {/* Wishlist, Share Toolbar */}
            <div className="flex items-center gap-3 border-t border-cream-dark/40 pt-4 mt-2">
              <button 
                onClick={() => toggleWishlist(product)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border shadow-sm transition-all focus:outline-none ${
                  isInWishlist(product._id)
                    ? 'bg-lavender text-charcoal-dark border-lavender-dark'
                    : 'bg-white/80 text-charcoal border-cream-dark hover:bg-cream/40'
                }`}
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>{isInWishlist(product._id) ? 'Wishlisted' : 'Add to Wishlist'}</span>
              </button>

              <button 
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-white/80 text-charcoal border border-cream-dark hover:bg-cream/40 shadow-sm transition-all relative focus:outline-none"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
                {shareSuccess && (
                  <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-charcoal text-white text-[9px] font-bold px-2 py-1 rounded shadow animate-fade-in whitespace-nowrap">
                    URL Copied!
                  </span>
                )}
              </button>
            </div>

          </div>

        </div>

        {/* Customer Reviews Section */}
        <div className="border-t border-cream-dark/50 pt-10 text-left">
          <h2 className="font-serif text-lg md:text-xl font-bold text-charcoal-dark uppercase tracking-wider mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-sage" />
            <span>Customer Reviews</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Average Rating Stats / Summary */}
            <div className="glass p-5 rounded-2xl border border-cream-dark/50 flex flex-col gap-3 font-sans text-xs">
              <h4 className="font-serif font-bold text-charcoal-dark text-sm">Reviews Summary</h4>
              <div className="flex items-center gap-2.5">
                <span className="text-3xl font-bold font-serif text-gold-dark">
                  {product.reviews && product.reviews.length > 0 
                    ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1)
                    : '5.0'}
                </span>
                <div className="flex flex-col gap-0.5">
                  <div className="flex text-gold">
                    {[1,2,3,4,5].map(n => <Star key={n} className="w-3.5 h-3.5 fill-current" />)}
                  </div>
                  <span className="text-[10px] text-charcoal-light">Based on {product.reviews?.length || 0} reviews</span>
                </div>
              </div>
              <p className="text-charcoal-light mt-1 border-t border-cream-dark/45 pt-3 leading-relaxed">
                Shared opinions and experiences assist in aligning intention. Clean frequencies support the collective.
              </p>
            </div>

            {/* Reviews List & Post Form */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* Existing Reviews */}
              {product.reviews && product.reviews.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {product.reviews.map((rev) => (
                    <div key={rev._id} className="glass p-5 rounded-2xl border border-cream-dark/45 flex flex-col gap-2 font-sans text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-charcoal-dark">{rev.name}</span>
                        <span className="text-[10px] text-charcoal-light">{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex text-gold">
                        {[1,2,3,4,5].map(n => (
                          <Star key={n} className={`w-3 h-3 ${n <= rev.rating ? 'fill-current' : 'text-charcoal/15'}`} />
                        ))}
                      </div>
                      <p className="text-charcoal/70 leading-relaxed mt-1">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass p-8 rounded-2xl border border-cream-dark/40 text-center flex flex-col items-center justify-center text-charcoal-light gap-2">
                  <MessageSquare className="w-8 h-8 opacity-40 text-sage" />
                  <span className="text-xs font-semibold">No reviews yet</span>
                  <span className="text-[10px] max-w-xs">Be the first to share your experience with this sacred healing product.</span>
                </div>
              )}

              {/* Leave a Review Form */}
              {user ? (
                <form onSubmit={handleReviewSubmit} className="glass p-5 rounded-2xl border border-cream-dark/50 flex flex-col gap-3 font-sans text-xs">
                  <h4 className="font-serif font-bold text-charcoal-dark text-sm border-b border-cream-dark pb-2">Leave a Review</h4>
                  
                  {reviewSuccess && (
                    <div className="bg-sage/10 text-sage border border-sage/20 p-3 rounded-xl flex items-center gap-2 font-semibold">
                      <CheckCircle className="w-4.5 h-4.5" />
                      <span>{reviewSuccess}</span>
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-charcoal-light uppercase">Rating</label>
                    <div className="flex gap-1.5 text-gold mt-1">
                      {[1,2,3,4,5].map(n => (
                        <button 
                          key={n}
                          type="button"
                          onClick={() => setRating(n)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star className={`w-5 h-5 ${n <= rating ? 'fill-current' : 'text-charcoal/15'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 mt-1">
                    <label className="text-[10px] font-bold text-charcoal-light uppercase">Comment</label>
                    <textarea 
                      required
                      rows="3" 
                      placeholder="Share your spiritual alignment and experiences..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="bg-cream-light border border-cream-dark/60 rounded-xl py-2 px-3 text-charcoal focus:outline-none focus:border-sage transition-all mt-1"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={reviewLoading}
                    className="bg-sage hover:bg-sage-dark text-white font-bold py-2.5 px-6 rounded-xl transition-colors text-[10px] uppercase tracking-wider shadow-sm self-start mt-2"
                  >
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <div className="glass p-4 rounded-xl border border-cream-dark/40 text-center text-xs">
                  Please <Link to="/login" className="text-gold font-bold hover:underline">Log In</Link> to share a rating and review for this product.
                </div>
              )}

            </div>

          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-cream-dark/50 pt-10 text-left">
            <h2 className="font-serif text-lg md:text-xl font-bold text-charcoal-dark uppercase tracking-wider mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <div key={p._id} className="glass rounded-2xl overflow-hidden flex flex-col p-4 shadow-sm border border-cream-dark/40 hover:shadow-md transition-all duration-300 relative group">
                  <Link to={`/product/${p._id}`} className="h-40 bg-cream rounded-xl overflow-hidden mb-3 block">
                    <img 
                      src={p.images && p.images[0] ? getImageUrl(p.images[0]) : "https://images.unsplash.com/photo-1615627121117-e3278bc8b1db?auto=format&fit=crop&w=400&q=80"} 
                      alt={p.name} 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                    />
                  </Link>
                  <div className="flex flex-col text-left gap-1 flex-1 font-sans text-xs">
                    <span className="text-[9px] uppercase tracking-widest text-sage font-bold">{p.category}</span>
                    <Link to={`/product/${p._id}`}>
                      <h4 className="font-serif font-bold text-charcoal-dark truncate hover:text-gold transition-colors">{p.name}</h4>
                    </Link>
                    <p className="font-bold text-gold-dark mt-1">₹{p.pricing}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;
