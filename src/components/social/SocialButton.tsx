"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react'; // Assuming lucide-react is available, otherwise I'll use text

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variants = {
  primary: 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20',
  secondary: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100',
  ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
  outline: 'border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300',
  danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/20',
  glass: 'glass-panel hover:bg-white/20 dark:hover:bg-black/20 text-gray-800 dark:text-gray-200 border-white/30',
};

const sizes = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 py-2 text-sm',
  lg: 'h-12 px-6 text-base',
  icon: 'h-10 w-10 p-2 flex items-center justify-center rounded-full',
};

export const SocialButton: React.FC<ButtonProps> = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  leftIcon, 
  rightIcon, 
  children, 
  disabled,
  ...props 
}) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none active:scale-95 cursor-pointer",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
      {!isLoading && leftIcon && <span className="ml-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="mr-2">{rightIcon}</span>}
    </button>
  );
};
