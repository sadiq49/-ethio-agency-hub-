import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  className?: string;
}

export function Logo({ 
  size = 'md', 
  variant = 'dark',
  className 
}: LogoProps) {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
  };

  const colorClasses = {
    light: 'text-white',
    dark: 'text-primary-700',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('rounded-lg bg-primary-600 p-1', sizeClasses[size])}>
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={cn('h-full w-auto', colorClasses[variant])}
        >
          <path 
            d="M12 2L2 7L12 12L22 7L12 2Z" 
            fill="currentColor" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M2 17L12 22L22 17" 
            fill="currentColor" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M2 12L12 17L22 12" 
            fill="currentColor" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className={cn(
        'font-bold tracking-tight', 
        colorClasses[variant],
        {
          'text-lg': size === 'sm',
          'text-xl': size === 'md',
          'text-2xl': size === 'lg',
        }
      )}>
        BoltHR
      </span>
    </div>
  );
}