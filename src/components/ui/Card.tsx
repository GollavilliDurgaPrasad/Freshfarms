import React from 'react';
import { twMerge } from 'tailwind-merge';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={twMerge('bg-white rounded-lg shadow-md overflow-hidden', className)}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={twMerge('p-4 border-b border-gray-200', className)}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <h3 className={twMerge('text-lg font-semibold text-gray-900', className)}>
      {children}
    </h3>
  );
};

export const CardContent: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={twMerge('p-4', className)}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={twMerge('p-4 border-t border-gray-200 bg-gray-50', className)}>
      {children}
    </div>
  );
};