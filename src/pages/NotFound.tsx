
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleReturnHome = () => {
    navigate("/dashboard");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 page-transition">
      <div className="text-center p-8 max-w-md mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-6">
          <AlertTriangle size={28} />
        </div>
        <h1 className="text-5xl font-bold mb-4 text-gray-900">404</h1>
        <p className="text-xl text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={handleReturnHome}
            className="bg-primary inline-flex items-center justify-center"
          >
            <Home size={16} className="mr-2" />
            Return to Dashboard
          </Button>
          <Button 
            variant="outline"
            onClick={handleGoBack}
            className="inline-flex items-center justify-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
