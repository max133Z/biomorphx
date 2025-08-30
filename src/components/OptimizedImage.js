"use client";

import { useState } from 'react';

const OptimizedImage = ({ src, alt, className, style, fallbackIcon }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleError = (e) => {
    console.error('Ошибка загрузки изображения:', src);
    setImageError(true);
    e.target.style.display = 'none';
  };

  const handleLoad = (e) => {
    setImageLoaded(true);
    setImageError(false);
  };

  if (imageError && fallbackIcon) {
    return (
      <div 
        className={`${className} fallback-icon`}
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          color: 'var(--accent)',
          background: 'rgba(26, 31, 74, 0.3)',
          borderRadius: '8px'
        }}
      >
        {fallbackIcon}
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      onError={handleError}
      onLoad={handleLoad}
    />
  );
};

export default OptimizedImage;
