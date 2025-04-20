import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  fullWidth?: boolean;
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, fullWidth = false, ...props }, ref) => {
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
        <select
          ref={ref}
          className={twMerge(
            'px-3 py-2 bg-white border shadow-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent',
            error ? 'border-red-500' : '',
            fullWidth ? 'w-full' : '',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;