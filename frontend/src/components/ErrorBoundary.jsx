import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
          <div className="glass p-8 rounded-3xl border border-cream-dark/60 bg-white/90 max-w-md shadow-xl flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-charcoal-dark">Something went wrong</h2>
            <p className="text-xs text-charcoal-light leading-relaxed">
              We encountered an unexpected issue while loading this section. Please try refreshing or returning to the home page.
            </p>
            {this.state.error?.message && (
              <div className="bg-cream p-3 rounded-xl text-[11px] font-mono text-charcoal-light w-full overflow-x-auto text-left border border-cream-dark/40">
                {this.state.error.message}
              </div>
            )}
            <div className="flex items-center gap-3 w-full mt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 bg-gold hover:bg-gold-dark text-charcoal-dark font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 bg-cream hover:bg-cream-dark text-charcoal font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all border border-cream-dark/60"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
