import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils'; // Assuming cn exists, if not I will use a simple join or clsx

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isBordered?: boolean;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
  xl: 'w-24 h-24',
};

export const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  size = 'md', 
  className,
  isBordered = false
}) => {
  return (
    <div className={cn(
      "relative rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 shrink-0", 
      sizeClasses[size],
      isBordered && "ring-2 ring-white dark:ring-gray-900",
      className
    )}>
      {src ? (
        <Image 
          src={src} 
          alt={alt} 
          fill 
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold">
          {alt.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};
