import React from 'react';

interface LoadingSkeletonProps {
  type?: 'text' | 'title' | 'button' | 'circle';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type = 'text',
  width,
  height,
  count = 1
}) => {
  const style = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined
  };
  
  return (
    <>
      {Array(count).fill(0).map((_, index) => (
        <div 
          key={index} 
          className={`skeleton ${type}`} 
          style={style}
          aria-hidden="true"
        />
      ))}
    </>
  );
};