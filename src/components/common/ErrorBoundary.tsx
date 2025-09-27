import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for monitoring (in production, send to error tracking service)
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full bg-card border border-border rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-destructive/10 rounded-full mb-4">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            
            <h2 className="text-xl font-semibold text-center text-foreground mb-2">
              Something went wrong
            </h2>
            
            <p className="text-muted-foreground text-center mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page or go back to the home page.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-4 p-3 bg-muted rounded border">
                <summary className="cursor-pointer font-medium text-sm">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 text-xs overflow-auto max-h-40 text-muted-foreground">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            
            <div className="flex gap-3">
              <Button
                onClick={() => window.location.reload()}
                variant="default"
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Page
              </Button>
              
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="flex-1"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;