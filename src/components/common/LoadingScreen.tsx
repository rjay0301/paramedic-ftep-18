
import React, { useState, useEffect } from 'react';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoadingScreenProps {
  message?: string;
  timeout?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Loading...', 
  timeout = 2000 // Further reduced default timeout to 2 seconds
}) => {
  const [showTimeout, setShowTimeout] = useState(false);
  const [showExtendedHelp, setShowExtendedHelp] = useState(false);
  const [loadingDots, setLoadingDots] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log(`LoadingScreen: Started with timeout of ${timeout}ms`);
    
    // Initial loading timer
    const timer = setTimeout(() => {
      console.log("Loading timeout triggered");
      setShowTimeout(true);
    }, timeout);
    
    // Extended help timer
    const extendedHelpTimer = setTimeout(() => {
      if (showTimeout) {
        setShowExtendedHelp(true);
      }
    }, timeout + 5000);
    
    // Animate loading dots
    const dotsInterval = setInterval(() => {
      setLoadingDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);
    
    return () => {
      console.log("Clearing loading timers");
      clearTimeout(timer);
      clearTimeout(extendedHelpTimer);
      clearInterval(dotsInterval);
    };
  }, [timeout, showTimeout]);
  
  const handleReload = () => {
    console.log("Manual reload triggered");
    
    // Clear any session-related data before reload
    try {
      const browserInstanceId = localStorage.getItem('ftep_browser_instance_id') || '';
      const keysToRemove = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('supabase.auth') && key.includes(browserInstanceId)) {
          keysToRemove.push(key);
        }
      }
      
      console.log(`Clearing ${keysToRemove.length} auth items before reload`);
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (err) {
      console.warn('Error clearing localStorage before reload:', err);
    }
    
    window.location.reload();
  };
  
  const handleRedirectToLogin = () => {
    console.log("Manual redirect to login");
    // Clear any potentially problematic session data
    try {
      localStorage.removeItem('supabase.auth.token');
      
      // Generate a new browser instance ID to prevent session conflicts
      const newInstanceId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
      localStorage.setItem('ftep_browser_instance_id', newInstanceId);
      console.log(`Generated new browser instance ID: ${newInstanceId.slice(0, 8)}`);
    } catch (err) {
      console.warn('Error clearing auth data before redirect:', err);
    }
    
    navigate('/login', { replace: true });
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background px-4">
      <div className="text-center max-w-md">
        {!showTimeout ? (
          <>
            <div className="p-4 bg-white rounded-xl shadow-md">
              <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
              <p className="text-gray-600 font-medium">{message}{loadingDots}</p>
              <p className="text-xs text-gray-400 mt-2">
                Please wait while we retrieve your data
              </p>
            </div>
          </>
        ) : (
          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 shadow-sm">
            <div className="flex items-center mb-2">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
              <h3 className="font-medium text-yellow-700">Loading is taking longer than expected</h3>
            </div>
            <p className="text-sm text-yellow-600 mb-3">
              This might be due to network issues or server load. You can try reloading the page or return to the login screen.
            </p>
            <div className="flex space-x-3 justify-center">
              <button
                onClick={handleReload}
                className="flex items-center text-sm bg-white border border-yellow-300 rounded px-4 py-2 text-yellow-700 hover:bg-yellow-50 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Reload page
              </button>
              <button 
                onClick={handleRedirectToLogin}
                className="text-sm bg-yellow-100 rounded px-4 py-2 text-yellow-700 hover:bg-yellow-200 transition-colors"
              >
                Go to login
              </button>
            </div>
            
            {showExtendedHelp && (
              <div className="mt-4 pt-3 border-t border-yellow-200">
                <p className="text-xs text-yellow-600 mb-2">
                  <strong>Still having trouble?</strong> Try these steps:
                </p>
                <ol className="text-xs text-yellow-600 list-decimal list-inside space-y-1 text-left">
                  <li>Clear your browser cookies and cache</li>
                  <li>Use a private/incognito browser window</li>
                  <li>Check your network connection</li>
                  <li>Try again in a few minutes</li>
                </ol>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
