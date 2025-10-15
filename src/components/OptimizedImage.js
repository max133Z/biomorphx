"use client";

import { useState, useEffect } from 'react';

const OptimizedImage = ({ src, alt, className, style, fallbackIcon, priority = false }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    // Intersection Observer для lazy loading
    if (!priority) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      // Используем setTimeout чтобы дать время DOM обновиться
      const timer = setTimeout(() => {
        const imgElement = document.querySelector(`[data-src="${src}"]`);
        if (imgElement) {
          observer.observe(imgElement);
        } else {
          // Если элемент не найден, загружаем изображение сразу
          setIsInView(true);
        }
      }, 100);

      return () => {
        clearTimeout(timer);
        observer.disconnect();
      };
    } else {
      setIsInView(true);
    }
  }, [src, priority]);

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
      src={priority ? src : (isInView ? src : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')}
      data-src={src}
      alt={alt}
      className={className}
      style={{
        ...style,
        opacity: priority ? 1 : (imageLoaded ? 1 : 0),
        transition: priority ? 'none' : 'opacity 0.3s ease-in-out'
      }}
      loading={priority ? 'eager' : 'lazy'}
      onError={handleError}
      onLoad={handleLoad}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
    />
  );
};

export default OptimizedImage;
