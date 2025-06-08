import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: '',
  };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Use error to set state, fixing TS6133
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected error occurred.',
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
          <div className="text-center p-6 max-w-md">
            <h1 className="text-3xl font-bold mb-4">Oops, Something Went Wrong</h1>
            <p className="text-gray-300 mb-6">{this.state.errorMessage}</p>
            <button
              className="px-6 py-3 bg-yellow-500 text-gray-900 rounded-md hover:bg-yellow-400 transition-colors"
              onClick={this.handleReload}
            >
              Reload Page
            </button>
            <p className="text-gray-400 mt-4 text-sm">
              If the issue persists, please contact{' '}
              <a href="mailto:support@kenyabespoke.com" className="underline">
                support@kenyabespoke.com
              </a>.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;