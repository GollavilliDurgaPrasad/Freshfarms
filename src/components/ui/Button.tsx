import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isFullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isFullWidth = false,
  isLoading = false,
  disabled = false,
  className = '',
}) => {
  // Base styles
  const baseStyles = 'font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Size styles
  const sizeStyles = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
  };
  
  // Variant styles
  const variantStyles = {
    primary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    secondary: 'bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500',
    outline: 'border border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500',
    ghost: 'text-green-600 hover:bg-green-50 focus:ring-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };
  
  // Width styles
  const widthStyles = isFullWidth ? 'w-full' : '';
  
  // Disabled and loading styles
  const disabledStyles = (disabled || isLoading) 
    ? 'opacity-60 cursor-not-allowed' 
    : 'cursor-pointer';
  
  // Merge all styles
  const styles = twMerge(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    widthStyles,
    disabledStyles,
    className
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={styles}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;