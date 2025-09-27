
import React, { useState } from 'react';
import { Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { RegistrationData } from '@/hooks/auth/registration/types';

interface SignupFormProps {
  onSignup: (data: RegistrationData) => Promise<void>;
  loading: boolean;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSignup, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [corporationNumber, setCorporationNumber] = useState('');
  const [apcBatch, setApcBatch] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords don't match. Please ensure both passwords are the same.");
      return;
    }
    
    if (!email || !password || !fullName || !corporationNumber || !apcBatch || !contactNumber) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const registrationData: RegistrationData = {
      email,
      password,
      fullName,
      corporationNumber,
      apcBatch,
      contactNumber
    };
    
    await onSignup(registrationData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mt-1"
          placeholder="John Smith"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="corporationNumber">Corporation Number</Label>
        <Input
          id="corporationNumber"
          type="text"
          value={corporationNumber}
          onChange={(e) => setCorporationNumber(e.target.value)}
          className="mt-1"
          placeholder="P12345"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="apcBatch">APC Batch</Label>
        <Input
          id="apcBatch"
          type="text"
          value={apcBatch}
          onChange={(e) => setApcBatch(e.target.value)}
          className="mt-1"
          placeholder="APC-2023"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="contactNumber">Contact Number</Label>
        <Input
          id="contactNumber"
          type="tel"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          className="mt-1"
          placeholder="555-123-4567"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1"
          placeholder="john.smith@example.com"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="signup-password">Password</Label>
        <div className="relative">
          <Input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 pr-10"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 mt-1"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1"
          required
        />
      </div>
      
      <div className="text-sm text-gray-600 mt-2 mb-2">
        <p>All accounts will require admin approval before access is granted. An administrator will assign your appropriate role.</p>
      </div>
      
      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <Loader2 className="animate-spin mr-2" size={18} />
        ) : (
          <Check className="mr-2" size={18} />
        )}
        Sign up
      </Button>
    </form>
  );
};

export default SignupForm;
