import React, { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4'>
          <div className='max-w-md w-full text-center'>
            <div className='mb-8'>
              <div className='text-6xl font-bold text-red-500 mb-4'>⚠️</div>
              <h1 className='text-3xl font-bold text-white mb-2'>Something went wrong</h1>
              <p className='text-gray-400 text-sm mb-6'>An error occurred. Our team has been notified.</p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className='bg-red-900 bg-opacity-30 border border-red-500 rounded p-3 text-left mb-6'>
                  <p className='text-red-200 text-xs font-mono break-words'>{this.state.error.message}</p>
                </div>
              )}
            </div>
            <a href='/' className='inline-block px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors'>
              Return Home
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
