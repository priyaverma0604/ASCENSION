import React, { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Sparkles, BookOpen, ShoppingBag, Heart } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const MobileBottomNav = () => {
  const { getCartCount } = useContext(CartContext);
  const location = useLocation();
  const cartCount = getCartCount();

  // Hide bottom nav on specific fullscreen pages if needed, but show on all standard user pages
  const isHidden = ['/login', '/register'].includes(location.pathname);

  if (isHidden) return null;

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/services', label: 'Services', icon: Sparkles },
    { to: '/programs', label: 'Programs', icon: BookOpen },
    { to: '/shop', label: 'Shop', icon: ShoppingBag, badge: cartCount },
    { to: '/donate', label: 'Seva', icon: Heart, highlight: true }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-cream-dark/65 shadow-[0_-4px_25px_rgba(0,0,0,0.07)] px-2 pt-1.5 pb-safe">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
          
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 min-w-[56px] ${
                isActive 
                  ? 'text-gold font-bold scale-[1.05]' 
                  : item.highlight 
                    ? 'text-sage hover:text-gold' 
                    : 'text-charcoal/70 hover:text-charcoal'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'} ${item.highlight && !isActive ? 'fill-sage/20 text-sage' : ''}`} />
                
                {/* Dynamic Cart Badge */}
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-gold text-charcoal-dark font-sans font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] tracking-tight mt-0.5 font-sans ${isActive ? 'font-bold text-gold-dark' : 'font-medium'}`}>
                {item.label}
              </span>

              {/* Active Dot Indicator */}
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-gold mt-0.5 animate-pulse-subtle" />
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
