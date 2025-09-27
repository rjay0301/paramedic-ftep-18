
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => {
  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className="bg-red-50 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-2" />
          <CardTitle className="text-xl font-semibold text-red-700">Error Loading Assignments</CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6">
          <p className="text-gray-700 mb-4">{error}</p>
          
          <Separator className="my-4" />
          
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-2">Troubleshooting tips:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Check your internet connection</li>
              <li>Refresh the page and try again</li>
              <li>Clear your browser cache</li>
              <li>Try logging out and logging back in</li>
            </ul>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={onRetry}
            className="flex-1 mr-2"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
          
          <Button 
            variant="secondary"
            onClick={() => window.location.href = '/dashboard'}
            className="flex-1 ml-2"
          >
            <HelpCircle className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ErrorDisplay;
