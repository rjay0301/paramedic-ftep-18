import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { validateAndSanitizeForm, loginSchema } from '@/utils/validation';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  loading: boolean;
  error: any;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, loading, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formTouched, setFormTouched] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('ftep_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('LoginForm mounted');
    }
  }, []);

  useEffect(() => {
    if (error === null && isSubmitting) {
      setIsSubmitting(false);
    }
  }, [error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    if (!formTouched) {
      setFormTouched(true);
    }
    
    if (id === 'login-email') {
      setEmail(value);
    } else if (id === 'login-password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateAndSanitizeForm({ email, password }, loginSchema);
    
    if (!validation.success) {
      const errorMessage = 'errors' in validation ? validation.errors[0] : 'Validation failed';
      toast.error(errorMessage);
      return;
    }
    
    const { data: validatedData } = validation;
    
    if (rememberMe) {
      localStorage.setItem('ftep_remembered_email', validatedData.email);
    } else {
      localStorage.removeItem('ftep_remembered_email');
    }
    
    setIsSubmitting(true);
    
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log(`Login form submitted for: ${validatedData.email}`);
      }
      
      await onLogin(validatedData.email, validatedData.password);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Login form error:', error);
      }
      toast.error('An unexpected error occurred during login');
      setIsSubmitting(false);
    }
  };

  const isButtonLoading = isSubmitting || loading;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="login-email" className="text-foreground">
          Email Address
        </Label>
        <Input
          id="login-email"
          type="email"
          value={email}
          onChange={handleInputChange}
          className="mt-1 mobile-input"
          placeholder="john.smith@example.com"
          required
          disabled={isButtonLoading}
          autoComplete="email"
          data-testid="email-input"
          aria-describedby="email-hint"
          aria-invalid={!email && formTouched ? 'true' : 'false'}
        />
        <div id="email-hint" className="sr-only">
          Enter your email address to sign in
        </div>
      </div>
      
      <div>
        <Label htmlFor="login-password" className="text-foreground">
          Password
        </Label>
        <div className="relative">
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handleInputChange}
            className="mt-1 pr-10 mobile-input"
            required
            disabled={isButtonLoading}
            autoComplete="current-password"
            data-testid="password-input"
            aria-describedby="password-hint"
            aria-invalid={!password && formTouched ? 'true' : 'false'}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground mt-1 focus:outline-none focus:ring-2 focus:ring-ring rounded"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isButtonLoading}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        <div id="password-hint" className="sr-only">
          Enter your password to sign in
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            className="h-4 w-4 text-primary border-input rounded focus:ring-2 focus:ring-ring"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isButtonLoading}
            aria-describedby="remember-hint"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-foreground">
            Remember me
          </label>
          <div id="remember-hint" className="sr-only">
            Keep me signed in on this device
          </div>
        </div>
        
        <button
          type="button"
          className="text-sm text-primary hover:text-primary/80 focus:outline-none focus:underline"
          onClick={() => toast.info('Password reset functionality will be available soon')}
        >
          Forgot password?
        </button>
      </div>
      
      {error && error.message && (
        <div 
          className="p-3 bg-destructive/10 border-l-4 border-destructive text-destructive text-sm rounded"
          role="alert"
          aria-live="polite"
        >
          {error.message}
        </div>
      )}
      
      <Button
        type="submit"
        disabled={isButtonLoading || !email || !password}
        className="w-full mobile-button"
        data-testid="login-button"
        aria-describedby="login-status"
      >
        {isButtonLoading ? (
          <>
            <Loader2 className="animate-spin mr-2" size={18} aria-hidden="true" />
            Signing in...
          </>
        ) : (
          <>
            <CheckCircle className="mr-2" size={18} aria-hidden="true" />
            Sign in
          </>
        )}
      </Button>
      
      <div id="login-status" className="sr-only" aria-live="polite">
        {isButtonLoading ? 'Signing in, please wait' : 'Ready to sign in'}
      </div>
    </form>
  );
};

export default LoginForm;