import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled React error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FFFDF7] p-6 font-sans">
          <div className="max-w-lg w-full bg-white p-8 rounded-3xl border-2 border-red-200 shadow-xl text-center flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl font-bold">
              ⚠️
            </div>
            <h2 className="font-serif text-2xl font-bold text-charcoal-dark">
              Something went wrong
            </h2>
            <p className="text-xs text-charcoal-light leading-relaxed">
              An unexpected error occurred while rendering the admin interface. Please click below to refresh the dashboard.
            </p>
            {this.state.error && (
              <div className="w-full bg-red-50 text-red-700 text-[11px] p-3 rounded-xl border border-red-200 font-mono text-left overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="bg-gold hover:bg-gold-dark text-charcoal-dark font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl shadow-md transition-all active:scale-95"
            >
              Reload Admin Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
