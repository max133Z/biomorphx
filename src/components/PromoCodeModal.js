"use client";

import { useEffect } from 'react';
import './styles/promo-code-modal.css';

export default function PromoCodeModal({ isOpen, onClose }) {
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

  const handleTelegramClick = () => {
    window.open('https://t.me/biomorphx', '_blank');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="promo-code-modal-overlay" onClick={onClose}>
      <div className="promo-code-modal" onClick={(e) => e.stopPropagation()}>
        <button className="promo-code-modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <div className="promo-code-modal-icon">
          <i className="fab fa-telegram"></i>
        </div>
        
        <h2 className="promo-code-modal-title">
          Получите скидку 15% на первый заказ
        </h2>
        
        <p className="promo-code-modal-text">
          Подпишитесь на наш <strong>Telegram канал</strong> и получите <strong>скидку 15%</strong> на первый заказ!
        </p>
        
        <div className="promo-code-modal-actions">
          <button className="promo-code-modal-button promo-code-modal-button-primary" onClick={handleTelegramClick}>
            <i className="fab fa-telegram"></i>
            Подписаться и получить скидку
          </button>
          <button className="promo-code-modal-button promo-code-modal-button-secondary" onClick={onClose}>
            Может быть позже
          </button>
        </div>
      </div>
    </div>
  );
}

