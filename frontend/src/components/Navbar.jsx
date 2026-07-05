import React, { useState, useContext } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Heart, User, LogOut, Compass } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Programs', path: '/programs' },
    { name: 'Shop', path: '/shop' },
    { name: 'Community', path: '/community' },
    { name: 'Seva NGO', path: '/ngo' },
    { name: 'CSR Partnerships', path: '/csr' },
    { name: 'Donate', path: '/donate' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <>
      <nav className="fixed top-0 z-50 w-full px-4 py-3 md:px-8">
      <div className="glass max-w-7xl mx-auto rounded-2xl shadow-sm px-6 py-3 flex items-center justify-between transition-all duration-300">

        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <img src={`${logo}?v=3`} alt="Ascension by Sonali Bhasin Kumar" className="h-10 md:h-10 w-auto object-contain" />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `text-xs font-semibold uppercase tracking-wider transition-colors duration-300 hover:text-gold ${isActive ? 'text-gold' : 'text-charcoal/80'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
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
                  <span className="absolute -top-1 -right-1 bg-gold text-white font-sans font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-cream shadow-sm">
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
                className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider bg-gold hover:bg-gold-dark text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-sm"
              >
                <User className="w-3.5 h-3.5" />
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
          <div className="glass rounded-2xl shadow-lg p-5 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold uppercase tracking-wider py-2 border-b border-cream/50 text-charcoal hover:text-gold transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
      </nav>
      {!isHomePage && <div className="h-[76px] md:h-[88px] w-full shrink-0" />}
    </>
  );
};

export default Navbar;
