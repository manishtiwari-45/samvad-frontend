import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background-tertiary flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-error" />
              </div>
              
              <h1 className="text-2xl font-bold text-primary mb-2">
                Oops! Something went wrong
              </h1>
              
              <p className="text-secondary mb-6">
                We encountered an unexpected error. Don't worry, our team has been notified.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-background-tertiary rounded-lg p-4 mb-6 text-left">
                  <h3 className="font-semibold text-primary mb-2">Error Details:</h3>
                  <pre className="text-xs text-secondary overflow-auto max-h-32">
                    {this.state.error.toString()}
                  </pre>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={this.handleRetry}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </button>
                
                <Link
                  to="/"
                  className="btn-secondary w-full flex items-center justify-center"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Link>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-secondary-muted">
                  If this problem persists, please contact support.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
