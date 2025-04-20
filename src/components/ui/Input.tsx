import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  fullWidth?: boolean;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, fullWidth = false, ...props }, ref) => {
    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label 
            htmlFor={props.id} 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={twMerge(
            'px-3 py-2 bg-white border shadow-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent',
            error ? 'border-red-500' : '',
            fullWidth ? 'w-full' : '',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;