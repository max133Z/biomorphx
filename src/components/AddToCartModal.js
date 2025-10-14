"use client";

import { useEffect } from 'react';

export default function AddToCartModal({ isOpen, product, onClose, onContinue, onCheckout }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div className="purchase-modal-overlay" onClick={handleOverlayClick}>
      <div className="purchase-modal" onClick={(e) => e.stopPropagation()}>
        <button className="purchase-modal-close" onClick={onClose} aria-label="Закрыть">
          <i className="fas fa-times"></i>
        </button>

        <div className="purchase-modal-header">
          <h2 className="purchase-modal-title">Товар добавлен в корзину!</h2>
          <p className="purchase-modal-subtitle">Выберите, что хотите сделать дальше</p>
        </div>

        <div className="purchase-modal-product">
          <div className="purchase-modal-product-image">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="purchase-modal-product-info">
            <div className="purchase-modal-product-name">{product.name}</div>
            <div className="purchase-modal-product-price">{product.price} ₽</div>
          </div>
        </div>

        <div className="purchase-modal-actions">
          <button className="purchase-modal-btn continue" onClick={onContinue}>
            <i className="fas fa-shopping-cart"></i> Продолжить покупки
          </button>
          <button className="purchase-modal-btn checkout" onClick={onCheckout}>
            <i className="fas fa-credit-card"></i> Оформить заказ
          </button>
        </div>
      </div>
    </div>
  );
}
