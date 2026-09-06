import React, { useState, useContext, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Heart, User, LogOut, ChevronDown } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [sevaDropdownOpen, setSevaDropdownOpen] = useState(false);
  const [mobileSevaOpen, setMobileSevaOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { user, logout } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === '/';
  const isSevaActive = ['/ngo', '/community', '/donate', '/csr'].includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/login');
  };

  return (
    <>
      <nav className={`fixed top-0 z-50 w-full px-3 sm:px-4 md:px-8 transition-all duration-300 ${isScrolled ? 'py-1.5' : 'py-2.5 sm:py-3'}`}>
        <div className={`glass max-w-7xl 2xl:max-w-screen-2xl 3xl:max-w-[1600px] mx-auto rounded-2xl flex items-center justify-between transition-all duration-300 ${isScrolled ? 'shadow-md py-2 px-4 sm:px-6' : 'shadow-sm py-2.5 sm:py-3 px-4 sm:px-6'}`}>

          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img src={`${logo}?v=3`} alt="Ascension by Sonali Bhasin Kumar" className="h-10 sm:h-11 md:h-12 w-auto object-contain transition-all duration-300" />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-7 2xl:gap-9">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-xs 2xl:text-sm font-semibold uppercase tracking-wider transition-colors duration-300 hover:text-gold ${isActive ? 'text-gold font-bold' : 'text-charcoal/80'}`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-xs 2xl:text-sm font-semibold uppercase tracking-wider transition-colors duration-300 hover:text-gold ${isActive ? 'text-gold font-bold' : 'text-charcoal/80'}`
              }
            >
              About
            </NavLink>

            <NavLink
              to="/services"
              className={({ isActive }) =>
                `text-xs 2xl:text-sm font-semibold uppercase tracking-wider transition-colors duration-300 hover:text-gold ${isActive ? 'text-gold font-bold' : 'text-charcoal/80'}`
              }
            >
              Services
            </NavLink>

            <NavLink
              to="/programs"
              className={({ isActive }) =>
                `text-xs 2xl:text-sm font-semibold uppercase tracking-wider transition-colors duration-300 hover:text-gold ${isActive ? 'text-gold font-bold' : 'text-charcoal/80'}`
              }
            >
              Programs
            </NavLink>

            <NavLink
              to="/webinars"
              className={({ isActive }) =>
                `text-xs 2xl:text-sm font-semibold uppercase tracking-wider transition-colors duration-300 hover:text-gold ${isActive || location.pathname === '/webinars' || location.pathname === '/webinar' ? 'text-gold font-bold' : 'text-charcoal/80'}`
              }
            >
              Webinars
            </NavLink>

            {/* Seva Dropdown Parent */}
            <div
              className="relative py-2"
              onMouseEnter={() => setSevaDropdownOpen(true)}
              onMouseLeave={() => setSevaDropdownOpen(false)}
            >
              <button
                onClick={() => setSevaDropdownOpen(!sevaDropdownOpen)}
                className={`text-xs 2xl:text-sm font-semibold uppercase tracking-wider transition-colors duration-300 hover:text-gold flex items-center gap-1 focus:outline-none ${isSevaActive ? 'text-gold font-bold' : 'text-charcoal/80'}`}
                aria-expanded={sevaDropdownOpen}
                aria-haspopup="true"
              >
                <span>Seva</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${sevaDropdownOpen ? 'rotate-180 text-gold' : 'text-charcoal/50'}`} />
              </button>

              {/* Dropdown Container */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-cream-dark/45 py-2.5 z-50 transition-all duration-300 origin-top transform ${sevaDropdownOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible pointer-events-none'
                  }`}
              >
                <Link
                  to="/ngo"
                  onClick={() => setSevaDropdownOpen(false)}
                  className={`block px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-cream-light/60 hover:text-gold-dark transition-colors duration-200 ${location.pathname === '/ngo' ? 'text-gold-dark bg-cream-light/35' : 'text-charcoal/85'
                    }`}
                >
                  Seva NGO
                </Link>
                <Link
                  to="/csr"
                  onClick={() => setSevaDropdownOpen(false)}
                  className={`block px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-cream-light/60 hover:text-gold-dark transition-colors duration-200 ${location.pathname === '/csr' ? 'text-gold-dark bg-cream-light/35' : 'text-charcoal/85'
                    }`}
                >
                  CSR Seva
                </Link>
                <Link
                  to="/community"
                  onClick={() => setSevaDropdownOpen(false)}
                  className={`block px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-cream-light/60 hover:text-gold-dark transition-colors duration-200 ${location.pathname === '/community' ? 'text-gold-dark bg-cream-light/35' : 'text-charcoal/85'
                    }`}
                >
                  Community
                </Link>
                <Link
                  to="/donate"
                  onClick={() => setSevaDropdownOpen(false)}
                  className={`block px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-cream-light/60 hover:text-gold-dark transition-colors duration-200 ${location.pathname === '/donate' ? 'text-gold-dark bg-cream-light/35' : 'text-charcoal/85'
                    }`}
                >
                  Donate
                </Link>
              </div>
            </div>

            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `text-xs 2xl:text-sm font-semibold uppercase tracking-wider transition-colors duration-300 hover:text-gold ${isActive ? 'text-gold font-bold' : 'text-charcoal/80'}`
              }
            >
              Shop
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-xs 2xl:text-sm font-semibold uppercase tracking-wider transition-colors duration-300 hover:text-gold ${isActive ? 'text-gold font-bold' : 'text-charcoal/80'}`
              }
            >
              Contact
            </NavLink>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Wishlist & Cart (Only visible when logged in) */}
            {user && (
              <>
                {/* Wishlist */}
                <Link to="/shop?tab=wishlist" className="relative p-2 text-charcoal hover:text-gold transition-colors duration-200" aria-label="Wishlist">
                  <Heart className="w-5 h-5" />
                  {wishlist.length > 0 && (
                    <span className="absolute top-0.5 right-0.5 bg-lavender text-charcoal-dark font-sans font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-cream shadow-sm">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                {/* Cart */}
                <Link to="/shop?tab=cart" className="relative p-2 text-charcoal hover:text-gold transition-colors duration-200" aria-label="Cart">
                  <ShoppingBag className="w-5 h-5" />
                  {getCartCount() > 0 && (
                    <span className="absolute top-0.5 right-0.5 bg-gold text-charcoal-dark font-sans font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-cream shadow-sm">
                      {getCartCount()}
                    </span>
                  )}
                </Link>
              </>
            )}

            {/* User Profile / Login */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-1.5 p-1.5 text-charcoal hover:text-gold transition-colors duration-200 focus:outline-none"
                    aria-label="User Account"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden md:inline text-xs font-medium max-w-[90px] truncate">{user.name}</span>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-52 glass rounded-2xl shadow-xl py-2 z-50 text-left transform origin-top-right transition-all border border-cream-dark/60 bg-white/95 backdrop-blur-md">
                      <div className="px-4 py-2.5 border-b border-cream-dark">
                        <p className="text-xs font-bold text-charcoal-dark truncate">{user.name}</p>
                        <p className="text-[11px] text-sage truncate">{user.email}</p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="block px-4 py-2.5 text-xs text-charcoal hover:bg-cream-dark/40 transition-colors duration-200"
                      >
                        My Profile & Programs
                      </Link>

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="block px-4 py-2.5 text-xs font-bold text-gold hover:bg-cream-dark/40 transition-colors duration-200"
                        >
                          Admin Backoffice
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-xs text-red-600 hover:bg-cream-dark/40 transition-colors duration-200"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-gold hover:bg-gold-dark text-charcoal-dark px-3.5 sm:px-4 py-2 rounded-xl transition-all duration-300 shadow-sm border border-gold-dark/20"
                >
                  <User className="w-3.5 h-3.5 text-charcoal-dark" />
                  <span>Login</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 lg:hidden text-charcoal hover:text-gold transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer Menu */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-charcoal/30 backdrop-blur-xs z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            <div className="lg:hidden mt-2 px-2 z-50 relative max-h-[82vh] overflow-y-auto animate-slide-up">
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-5 flex flex-col gap-2 border border-cream-dark/80">
                
                {/* User Header on Mobile Drawer */}
                {user ? (
                  <div className="flex items-center justify-between pb-3 mb-1 border-b border-cream-dark/70">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gold/20 text-gold-dark flex items-center justify-center font-bold text-sm">
                        {user.name ? user.name[0].toUpperCase() : 'U'}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-bold text-charcoal-dark">{user.name}</span>
                        <span className="text-[10px] text-charcoal-light truncate max-w-[170px]">{user.email}</span>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="text-[10px] font-bold uppercase text-gold bg-gold/10 px-2.5 py-1 rounded-lg hover:bg-gold/20 transition-all"
                    >
                      Profile
                    </Link>
                  </div>
                ) : (
                  <div className="pb-3 mb-1 border-b border-cream-dark/70 flex justify-between items-center">
                    <span className="text-xs text-charcoal-light font-medium">Welcome to Ascension</span>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="text-xs font-bold text-charcoal-dark bg-gold px-3.5 py-1.5 rounded-xl uppercase tracking-wider"
                    >
                      Sign In
                    </Link>
                  </div>
                )}

                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className={`text-xs font-bold uppercase tracking-wider py-2.5 px-2 rounded-xl hover:bg-cream-dark/30 hover:text-gold transition-colors ${location.pathname === '/' ? 'text-gold bg-gold/10' : 'text-charcoal'}`}
                >
                  Home
                </Link>

                <Link
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className={`text-xs font-bold uppercase tracking-wider py-2.5 px-2 rounded-xl hover:bg-cream-dark/30 hover:text-gold transition-colors ${location.pathname === '/about' ? 'text-gold bg-gold/10' : 'text-charcoal'}`}
                >
                  About
                </Link>

                <Link
                  to="/services"
                  onClick={() => setIsOpen(false)}
                  className={`text-xs font-bold uppercase tracking-wider py-2.5 px-2 rounded-xl hover:bg-cream-dark/30 hover:text-gold transition-colors ${location.pathname === '/services' ? 'text-gold bg-gold/10' : 'text-charcoal'}`}
                >
                  Services & Healing
                </Link>

                <Link
                  to="/programs"
                  onClick={() => setIsOpen(false)}
                  className={`text-xs font-bold uppercase tracking-wider py-2.5 px-2 rounded-xl hover:bg-cream-dark/30 hover:text-gold transition-colors ${location.pathname === '/programs' ? 'text-gold bg-gold/10' : 'text-charcoal'}`}
                >
                  Programs
                </Link>

                <Link
                  to="/webinars"
                  onClick={() => setIsOpen(false)}
                  className={`text-xs font-bold uppercase tracking-wider py-2.5 px-2 rounded-xl hover:bg-cream-dark/30 hover:text-gold transition-colors ${location.pathname === '/webinars' || location.pathname === '/webinar' ? 'text-gold bg-gold/10' : 'text-charcoal'}`}
                >
                  Live Webinars
                </Link>

                {/* Mobile Seva Accordion */}
                <div className="flex flex-col rounded-xl overflow-hidden">
                  <button
                    onClick={() => setMobileSevaOpen(!mobileSevaOpen)}
                    className={`text-xs font-bold uppercase tracking-wider py-2.5 px-2 rounded-xl hover:bg-cream-dark/30 hover:text-gold flex items-center justify-between transition-colors focus:outline-none ${isSevaActive ? 'text-gold bg-gold/10' : 'text-charcoal'}`}
                  >
                    <span>Ascension Seva</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileSevaOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div
                    className={`flex flex-col pl-3 gap-1 transition-all duration-300 overflow-hidden ${mobileSevaOpen ? 'max-h-48 pb-2 pt-1' : 'max-h-0'
                      }`}
                  >
                    <Link
                      to="/ngo"
                      onClick={() => setIsOpen(false)}
                      className={`text-xs font-semibold py-2 px-3 rounded-lg hover:bg-cream/50 hover:text-gold transition-colors ${location.pathname === '/ngo' ? 'text-gold font-bold bg-cream-light' : 'text-charcoal-light'}`}
                    >
                      • Seva NGO Initiatives
                    </Link>
                    <Link
                      to="/csr"
                      onClick={() => setIsOpen(false)}
                      className={`text-xs font-semibold py-2 px-3 rounded-lg hover:bg-cream/50 hover:text-gold transition-colors ${location.pathname === '/csr' ? 'text-gold font-bold bg-cream-light' : 'text-charcoal-light'}`}
                    >
                      • CSR Corporate Partnership
                    </Link>
                    <Link
                      to="/community"
                      onClick={() => setIsOpen(false)}
                      className={`text-xs font-semibold py-2 px-3 rounded-lg hover:bg-cream/50 hover:text-gold transition-colors ${location.pathname === '/community' ? 'text-gold font-bold bg-cream-light' : 'text-charcoal-light'}`}
                    >
                      • Community Stories
                    </Link>
                    <Link
                      to="/donate"
                      onClick={() => setIsOpen(false)}
                      className={`text-xs font-bold py-2 px-3 rounded-lg text-sage hover:text-gold transition-colors flex items-center gap-1.5 ${location.pathname === '/donate' ? 'text-gold font-bold bg-cream-light' : ''}`}
                    >
                      <Heart className="w-3.5 h-3.5 fill-current text-red-500" />
                      <span>Donate to Seva</span>
                    </Link>
                  </div>
                </div>

                <Link
                  to="/shop"
                  onClick={() => setIsOpen(false)}
                  className={`text-xs font-bold uppercase tracking-wider py-2.5 px-2 rounded-xl hover:bg-cream-dark/30 hover:text-gold transition-colors ${location.pathname === '/shop' ? 'text-gold bg-gold/10' : 'text-charcoal'}`}
                >
                  Spiritual Shop
                </Link>

                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className={`text-xs font-bold uppercase tracking-wider py-2.5 px-2 rounded-xl hover:bg-cream-dark/30 hover:text-gold transition-colors ${location.pathname === '/contact' ? 'text-gold bg-gold/10' : 'text-charcoal'}`}
                >
                  Contact & Location
                </Link>

                {/* Direct Mobile Contact Actions */}
                <div className="pt-3 mt-2 border-t border-cream-dark/70 flex gap-2">
                  <a
                    href="https://wa.me/918929061557?text=Hi%20Sonali%20Ma'am,%20I%20would%20like%20to%20know%20more%20about%20Ascension%20sessions."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href="tel:+918929061557"
                    className="flex-1 bg-cream-dark hover:bg-cream text-charcoal-dark text-[11px] font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-cream-dark/80"
                  >
                    <span>Call Us</span>
                  </a>
                </div>

              </div>
            </div>
          </>
        )}
      </nav>
      {!isHomePage && <div className="h-[65px] sm:h-[70px] md:h-[80px] w-full shrink-0" />}
    </>
  );
};

export default Navbar;
