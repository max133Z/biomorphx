"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import products from '../data/products';

const Cart = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    isCartOpen,
    closeCart,
    clearCart
  } = useCart();

  // Получаем информацию о товаре
  const getProductInfo = (productId) => {
    return products.find(p => p.id === productId);
  };

  // Закрытие по ESC
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      const handleEscape = (event) => {
        if (event.key === 'Escape') {
          closeCart();
        }
      };
      window.addEventListener('keydown', handleEscape);
      return () => {
        window.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  return (
    <div className="cart-overlay" onClick={closeCart}>
      <div className="cart-container" onClick={e => e.stopPropagation()}>
        {/* Заголовок */}
        <div className="cart-header">
          <h2>ВАША КОРЗИНА</h2>
          <button className="cart-close" onClick={closeCart}>×</button>
        </div>

        {/* Содержимое */}
        <div className="cart-content">
          {items.length === 0 ? (
            <div className="empty-cart">
              <p>Ваша корзина пуста</p>
            </div>
          ) : (
            <>
              {/* Список товаров */}
              {items.map(item => {
                const product = getProductInfo(item.id);
                if (!product) return null;

                return (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-image">
                      <img src={product.image} alt={product.name} />
                    </div>
                    
                    <div className="cart-item-info">
                      <h4>{product.name}</h4>
                      <p className="cart-item-price">{product.price} ₽</p>
                    </div>
                    
                    <div className="cart-item-quantity">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="quantity-btn"
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="cart-item-total">
                      <span>{product.price * item.quantity} ₽</span>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="remove-btn"
                    >
                      Удалить
                    </button>
                  </div>
                );
              })}
            </>
          )}
        </div>
        
        {/* Футер */}
        <div className="cart-footer">
          <div className="cart-total">
            <span>Итого:</span>
            <span>{getTotalPrice()} ₽</span>
          </div>
          <div className="cart-footer-buttons">
            <button className="checkout-btn" onClick={() => {
              closeCart();
              window.location.href = '/checkout';
            }}>Оформить заказ</button>
            <a href="/checkout" className="view-cart-btn" onClick={closeCart}>
              <i className="fas fa-shopping-bag"></i> Полная корзина
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
