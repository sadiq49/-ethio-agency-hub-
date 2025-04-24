import Image from 'next/image';
import { useState } from 'react';

// Optimized image component with lazy loading and blur placeholder
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) {
  const [isLoading, setIsLoading] = useState(true);
  
  return (
    <div className={`relative ${isLoading ? 'bg-gray-200 animate-pulse' : ''}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
        onLoadingComplete={() => setIsLoading(false)}
        loading="lazy"
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFdwI2QOQvhAAAAABJRU5ErkJggg=="
      />
    </div>
  );
}