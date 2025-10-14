"use client";

import { useEffect } from 'react';

export default function ImageModal({ isOpen, imageSrc, imageAlt, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="image-modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        <div className="image-modal-image-container">
          <img src={imageSrc} alt={imageAlt} className="image-modal-image" />
        </div>
        <div className="image-modal-caption">
          <p>{imageAlt}</p>
        </div>
      </div>
    </div>
  );
}


