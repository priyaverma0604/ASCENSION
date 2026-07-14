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
      <nav className={`fixed top-0 z-50 w-full px-4 transition-all duration-300 ${isScrolled ? 'py-1.5 md:px-8' : 'py-3 md:px-8'}`}>
        <div className={`glass max-w-7xl mx-auto rounded-2xl flex items-center justify-between transition-all duration-300 ${isScrolled ? 'shadow-md py-2 px-6' : 'shadow-sm py-3 px-6'}`}>

          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img src={`${logo}?v=3`} alt="Ascension by Sonali Bhasin Kumar" className="h-11 md:h-12 w-auto object-contain transition-all duration-300" />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-7">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-[11px] font-semibold uppercase tracking-wider transition-colors duration-300 hover:text-gold ${isActive ? 'text-gold font-bold' : 'text-charcoal/80'}`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-[11px] font-semibold uppercase tracking-wider transition-colors duration-300 hover:text-gold ${isActive ? 'text-gold font-bold' : 'text-charcoal/80'}`
              }
            >
              About
            </NavLink>

            <NavLink
              to="/services"
              className={({ isActive }) =>
                `text-[11px] font-semibold uppercase tracking-wider transition-colors duration-300 hover:text-gold ${isActive ? 'text-gold font-bold' : 'text-charcoal/80'}`
              }
            >
              Services
            </NavLink>

            <NavLink
              to="/programs"
              className={({ isActive }) =>
                `text-[11px] font-semibold uppercase tracking-wider transition-colors duration-300 hover:text-gold ${isActive ? 'text-gold font-bold' : 'text-charcoal/80'}`
              }
            >
              Programs
            </NavLink>

            {/* Seva Dropdown Parent */}
            <div
              className="relative py-2"
              onMouseEnter={() => setSevaDropdownOpen(true)}
              onMouseLeave={() => setSevaDropdownOpen(false)}
            >
              <button
                onClick={() => setSevaDropdownOpen(!sevaDropdownOpen)}
                className={`text-[11px] font-semibold uppercase tracking-wider transition-colors duration-300 hover:text-gold flex items-center gap-1 focus:outline-none ${isSevaActive ? 'text-gold font-bold' : 'text-charcoal/80'}`}
                aria-expanded={sevaDropdownOpen}
                aria-haspopup="true"
              >
                <span>Seva</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${sevaDropdownOpen ? 'rotate-180 text-gold' : 'text-charcoal/50'}`} />
              </button>

              {/* Dropdown Container */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 mt-2 w-44 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-cream-dark/45 py-2.5 z-50 transition-all duration-300 origin-top transform ${sevaDropdownOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible pointer-events-none'
                  }`}
              >
                <Link
                  to="/ngo"
                  onClick={() => setSevaDropdownOpen(false)}
                  className={`block px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider hover:bg-cream-light/60 hover:text-gold-dark transition-colors duration-200 ${location.pathname === '/ngo' ? 'text-gold-dark bg-cream-light/35' : 'text-charcoal/85'
                    }`}
                >
                  Seva NGO
                </Link>
                <Link
                  to="/csr"
                  onClick={() => setSevaDropdownOpen(false)}
                  className={`block px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider hover:bg-cream-light/60 hover:text-gold-dark transition-colors duration-200 ${location.pathname === '/csr' ? 'text-gold-dark bg-cream-light/35' : 'text-charcoal/85'
                    }`}
                >
                  CSR Seva
                </Link>
                <Link
                  to="/community"
                  onClick={() => setSevaDropdownOpen(false)}
                  className={`block px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider hover:bg-cream-light/60 hover:text-gold-dark transition-colors duration-200 ${location.pathname === '/community' ? 'text-gold-dark bg-cream-light/35' : 'text-charcoal/85'
                    }`}
                >
                  Community
                </Link>
                <Link
                  to="/donate"
                  onClick={() => setSevaDropdownOpen(false)}
                  className={`block px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider hover:bg-cream-light/60 hover:text-gold-dark transition-colors duration-200 ${location.pathname === '/donate' ? 'text-gold-dark bg-cream-light/35' : 'text-charcoal/85'
                    }`}
                >
                  Donate
                </Link>
              </div>
            </div>

            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `text-[11px] font-semibold uppercase tracking-wider transition-colors duration-300 hover:text-gold ${isActive ? 'text-gold font-bold' : 'text-charcoal/80'}`
              }
            >
              Shop
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-[11px] font-semibold uppercase tracking-wider transition-colors duration-300 hover:text-gold ${isActive ? 'text-gold font-bold' : 'text-charcoal/80'}`
              }
            >
              Contact
            </NavLink>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            {/* Wishlist & Cart (Only visible when logged in) */}
            {user && (
              <>
                {/* Wishlist */}
                <Link to="/shop?tab=wishlist" className="relative p-1.5 text-charcoal hover:text-gold transition-colors duration-200">
                  <Heart className="w-5 h-5" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-lavender text-charcoal-dark font-sans font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-cream shadow-sm">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                {/* Cart */}
                <Link to="/shop?tab=cart" className="relative p-1.5 text-charcoal hover:text-gold transition-colors duration-200">
                  <ShoppingBag className="w-5 h-5" />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gold text-charcoal-dark font-sans font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-cream shadow-sm">
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
                    className="flex items-center gap-1.5 p-1 text-charcoal hover:text-gold transition-colors duration-200 focus:outline-none"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden md:inline text-xs font-medium max-w-[80px] truncate">{user.name}</span>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-48 glass rounded-xl shadow-lg py-2 z-50 text-left transform origin-top-right transition-all">
                      <div className="px-4 py-2 border-b border-cream-dark">
                        <p className="text-xs font-bold text-charcoal-dark truncate">{user.name}</p>
                        <p className="text-[10px] text-sage truncate">{user.email}</p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="block px-4 py-2 text-xs text-charcoal hover:bg-cream-dark transition-colors duration-200"
                      >
                        My Profile
                      </Link>

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="block px-4 py-2 text-xs font-bold text-gold hover:bg-cream-dark transition-colors duration-200"
                        >
                          Admin Panel
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-cream-dark transition-colors duration-200"
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
                  className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider bg-gold hover:bg-gold-dark text-charcoal-dark px-4 py-2 rounded-xl transition-all duration-300 shadow-sm border border-gold-dark/20"
                >
                  <User className="w-3.5 h-3.5 text-charcoal-dark" />
                  <span>Login</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 lg:hidden text-charcoal hover:text-gold transition-colors focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {isOpen && (
          <div className="lg:hidden mt-2 px-2 z-50 relative">
            <div className="glass rounded-2xl shadow-lg p-5 flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className={`text-xs font-bold uppercase tracking-wider py-2.5 border-b border-cream/50 hover:text-gold transition-colors ${location.pathname === '/' ? 'text-gold' : 'text-charcoal'}`}
              >
                Home
              </Link>

              <Link
                to="/about"
                onClick={() => setIsOpen(false)}
                className={`text-xs font-bold uppercase tracking-wider py-2.5 border-b border-cream/50 hover:text-gold transition-colors ${location.pathname === '/about' ? 'text-gold' : 'text-charcoal'}`}
              >
                About
              </Link>

              <Link
                to="/services"
                onClick={() => setIsOpen(false)}
                className={`text-xs font-bold uppercase tracking-wider py-2.5 border-b border-cream/50 hover:text-gold transition-colors ${location.pathname === '/services' ? 'text-gold' : 'text-charcoal'}`}
              >
                Services
              </Link>

              <Link
                to="/programs"
                onClick={() => setIsOpen(false)}
                className={`text-xs font-bold uppercase tracking-wider py-2.5 border-b border-cream/50 hover:text-gold transition-colors ${location.pathname === '/programs' ? 'text-gold' : 'text-charcoal'}`}
              >
                Programs
              </Link>

              {/* Mobile Seva Accordion */}
              <div className="flex flex-col border-b border-cream/50">
                <button
                  onClick={() => setMobileSevaOpen(!mobileSevaOpen)}
                  className={`text-xs font-bold uppercase tracking-wider py-2.5 hover:text-gold flex items-center justify-between transition-colors focus:outline-none ${isSevaActive ? 'text-gold' : 'text-charcoal'}`}
                >
                  <span>Seva</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileSevaOpen ? 'rotate-180' : ''}`} />
                </button>
                <div
                  className={`flex flex-col pl-4 gap-2 transition-all duration-300 overflow-hidden ${mobileSevaOpen ? 'max-h-40 pb-3 pt-1' : 'max-h-0'
                    }`}
                >
                  <Link
                    to="/ngo"
                    onClick={() => setIsOpen(false)}
                    className={`text-xs font-semibold py-1.5 hover:text-gold transition-colors ${location.pathname === '/ngo' ? 'text-gold' : 'text-charcoal-light'}`}
                  >
                    Seva NGO
                  </Link>
                  <Link
                    to="/csr"
                    onClick={() => setIsOpen(false)}
                    className={`text-xs font-semibold py-1.5 hover:text-gold transition-colors ${location.pathname === '/csr' ? 'text-gold' : 'text-charcoal-light'}`}
                  >
                    CSR Seva
                  </Link>
                  <Link
                    to="/community"
                    onClick={() => setIsOpen(false)}
                    className={`text-xs font-semibold py-1.5 hover:text-gold transition-colors ${location.pathname === '/community' ? 'text-gold' : 'text-charcoal-light'}`}
                  >
                    Community
                  </Link>
                  <Link
                    to="/donate"
                    onClick={() => setIsOpen(false)}
                    className={`text-xs font-semibold py-1.5 hover:text-gold transition-colors ${location.pathname === '/donate' ? 'text-gold' : 'text-charcoal-light'}`}
                  >
                    Donate
                  </Link>
                </div>
              </div>

              <Link
                to="/shop"
                onClick={() => setIsOpen(false)}
                className={`text-xs font-bold uppercase tracking-wider py-2.5 border-b border-cream/50 hover:text-gold transition-colors ${location.pathname === '/shop' ? 'text-gold' : 'text-charcoal'}`}
              >
                Shop
              </Link>

              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className={`text-xs font-bold uppercase tracking-wider py-2.5 border-b border-cream/50 hover:text-gold transition-colors ${location.pathname === '/contact' ? 'text-gold' : 'text-charcoal'}`}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>
      {!isHomePage && <div className="h-[70px] md:h-[80px] w-full shrink-0" />}
    </>
  );
};

export default Navbar;
