
import React, { Suspense, useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/auth/AuthContext';
import AppRoutes from './components/routing/AppRoutes';
import LoadingScreen from './components/common/LoadingScreen';
import ErrorBoundary from './components/common/ErrorBoundary';
import { supabase } from './integrations/supabase/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [hasError, setHasError] = useState(false);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);

  // Initialize application and clean up orphaned sessions
  useEffect(() => {
    const browserInstanceId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('ftep_browser_instance_id', browserInstanceId);
    
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`App initialized - Browser instance: ${browserInstanceId}`);
    }
    
    // Clean up orphaned sessions from localStorage
    try {
      const keys = Object.keys(localStorage);
      const orphanedKeys = keys.filter(key => 
        key.startsWith('browser_') && key.includes('_startup') &&
        Date.now() - new Date(JSON.parse(localStorage.getItem(key) || '{}').timestamp || 0).getTime() > 24 * 60 * 60 * 1000
      );
      orphanedKeys.forEach(key => localStorage.removeItem(key));
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to clean orphaned sessions:', err);
      }
    }
  }, []);

  // Global error handler
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('Global error caught:', event.error);
      }
      setHasError(true);
      const errorMessage = event.error?.message || 'An unknown error occurred';
      setErrorInfo(`${errorMessage}\n\nPlease try refreshing the page or contact support if the issue persists.`);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('Unhandled promise rejection:', event.reason);
      }
      setHasError(true);
      const errorMessage = event.reason?.message || 'An unknown promise rejection occurred';
      setErrorInfo(`${errorMessage}\n\nPlease try refreshing the page or contact support if the issue persists.`);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Check Supabase connectivity in development only
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const checkSupabaseConnection = async () => {
        try {
          const { error } = await supabase.from('students').select('id').limit(1);
          if (error) {
            console.warn('Supabase connection check failed:', error.message);
          } else {
            console.log('Supabase connection verified successfully');
          }
        } catch (err) {
          console.warn('Failed to check Supabase connectivity:', err);
        }
      };
      
      setTimeout(checkSupabaseConnection, 1000);
    }
  }, []);

  // Improved error UI
  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-red-600 text-xl font-semibold mb-4">Application Error</h2>
          <p className="text-gray-700 mb-4">
            Sorry, something went wrong with the application. 
          </p>
          {errorInfo && (
            <div className="bg-gray-50 p-3 rounded border border-gray-200 mb-4 overflow-auto max-h-40">
              <code className="text-sm text-gray-800 whitespace-pre-wrap">{errorInfo}</code>
            </div>
          )}
          <div className="flex gap-3">
            <button 
              onClick={() => {
                // Only clear auth data for this specific browser instance
                try {
                  const browserInstanceId = localStorage.getItem('ftep_browser_instance_id') || 'unknown';
                  const keysToRemove = [];
                  
                  for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && ((key.includes('supabase') || key.includes('sb-')) && key.includes(browserInstanceId))) {
                      keysToRemove.push(key);
                    }
                  }
                  
                  console.log(`Clearing ${keysToRemove.length} auth items for browser ${browserInstanceId.slice(0, 8)}`);
                  keysToRemove.forEach(key => localStorage.removeItem(key));
                } catch (err) {
                  console.warn('Error clearing localStorage:', err);
                }
                window.location.reload();
              }} 
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700 transition-colors"
            >
              Reload Application
            </button>
            <button 
              onClick={() => window.location.href = '/login'} 
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main application rendering with improved error boundary
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <div className="App min-h-screen bg-background">
              <Suspense fallback={<LoadingScreen message="Initializing application..." timeout={2000} />}>
                <AppRoutes />
              </Suspense>
              <Toaster 
                position="top-right"
                closeButton={true}
                duration={4000}
                theme="system"
                richColors
                expand={true}
                visibleToasts={3}
              />
            </div>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
