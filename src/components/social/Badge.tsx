import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'glass' | 'success' | 'warning';
  className?: string;
  size?: 'sm' | 'md';
}

const variants = {
  primary: 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20',
  secondary: 'bg-gray-100 dark:bg-[#1c1e26] text-gray-600 dark:text-gray-300',
  outline: 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300',
  glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-sm',
  success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
};

const sizes = {
  sm: 'text-[10px] px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
};

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'secondary', 
  className,
  size = 'md' 
}) => {
  return (
    <span className={cn(
      "inline-flex items-center justify-center rounded-full font-medium transition-colors",
      variants[variant],
      sizes[size],
      className
    )}>
      {children}
    </span>
  );
};
