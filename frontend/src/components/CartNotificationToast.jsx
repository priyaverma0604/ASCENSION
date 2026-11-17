import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { CheckCircle2, X, ArrowRight } from 'lucide-react';

const CartNotificationToast = () => {
  const { toast, hideToast } = useContext(CartContext);
  const navigate = useNavigate();

  if (!toast) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 max-w-sm w-[calc(100vw-2rem)] sm:w-auto animate-slide-up">
      <div className="bg-[#FFFDF9]/95 backdrop-blur-xl border-2 border-gold/40 shadow-2xl rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 text-left">
        {/* Checkmark Icon Badge */}
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-center shrink-0 text-emerald-600 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        </div>

        {/* Text Info */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
              Product Added to Cart!
            </span>
          </div>
          <p className="text-xs font-semibold text-charcoal-dark truncate mt-0.5" title={toast.productName}>
            {toast.productName}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              hideToast();
              navigate('/shop?tab=cart');
            }}
            className="bg-gold hover:bg-gold-dark text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider py-1.5 px-3 rounded-lg shadow-sm transition-all duration-200 flex items-center gap-1 cursor-pointer hover:scale-102"
          >
            <span>View Cart</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={hideToast}
            className="text-charcoal-light hover:text-charcoal p-1 rounded-full transition-colors cursor-pointer"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartNotificationToast;
