import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';

type LoginFormData = {
  email: string;
  password: string;
};

const AdminLogin: React.FC = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      const result = await login(data.email, data.password);
      
      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setLoginError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // For demo purposes, prefill with demo credentials
  const fillDemoCredentials = () => {
    // This would be replaced with actual demo credentials in a real app
    document.getElementById('email')?.setAttribute('value', 'admin@example.com');
    document.getElementById('password')?.setAttribute('value', 'password123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Truck className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Admin Login</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access the HarvestHub admin dashboard
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center text-gray-600">
              <Lock className="mr-2 h-5 w-5" />
              Secure Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {loginError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  {loginError}
                </div>
              )}
              
              <div>
                <Input
                  id="email"
                  label="Email Address"
                  type="email"
                  autoComplete="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Invalid email address',
                    },
                  })}
                  error={errors.email?.message}
                  fullWidth
                />
              </div>
              
              <div>
                <Input
                  id="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  {...register('password', { required: 'Password is required' })}
                  error={errors.password?.message}
                  fullWidth
                />
              </div>
              
              <div>
                <Button
                  type="submit"
                  isFullWidth
                  isLoading={isLoading}
                >
                  Sign in
                </Button>
              </div>
              
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-sm text-green-600 hover:text-green-500"
                >
                  Use demo credentials
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;