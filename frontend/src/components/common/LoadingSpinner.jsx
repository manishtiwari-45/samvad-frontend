import React from 'react';
import { Sparkles } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', message = 'Loading...', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center">
          <div className="relative">
            <div className={`${sizeClasses[size]} mx-auto mb-4 animate-spin`}>
              <div className="absolute inset-0 rounded-full border-4 border-accent/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent animate-spin"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-accent animate-pulse" />
            </div>
          </div>
          <p className={`${textSizes[size]} text-primary font-medium`}>{message}</p>
          <p className="text-sm text-secondary mt-1">Please wait a moment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="text-center">
        <div className="relative">
          <div className={`${sizeClasses[size]} mx-auto mb-2 animate-spin`}>
            <div className="absolute inset-0 rounded-full border-4 border-accent/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent animate-spin"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-accent animate-pulse" />
          </div>
        </div>
        <p className={`${textSizes[size]} text-primary font-medium`}>{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
