"use client";

import { useEffect } from 'react';
import './styles/free-delivery-modal.css';

export default function FreeDeliveryModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="free-delivery-modal-overlay" onClick={onClose}>
      <div className="free-delivery-modal" onClick={(e) => e.stopPropagation()}>
        <button className="free-delivery-modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <div className="free-delivery-modal-icon">
          <i className="fas fa-gift"></i>
        </div>
        
        <h2 className="free-delivery-modal-title">
          🎉 Отличная новость!
        </h2>
        
        <p className="free-delivery-modal-text">
          Теперь доступна <strong>бесплатная доставка</strong> в любой город России через службу <strong>СДЭК</strong>!
        </p>
        
        <button className="free-delivery-modal-button" onClick={onClose}>
          Понятно, спасибо!
        </button>
      </div>
    </div>
  );
}

