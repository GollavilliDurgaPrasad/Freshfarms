import React from 'react';
import { twMerge } from 'tailwind-merge';

type BadgeProps = {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
};

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  // Variant styles
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  // Size styles
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
  };

  // Base styles
  const baseStyles = 'inline-flex items-center font-medium rounded-full';

  // Merge all styles
  const styles = twMerge(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  return <span className={styles}>{children}</span>;
};

export default Badge;