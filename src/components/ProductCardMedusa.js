"use client";

import { useState } from 'react';
import { useCart } from "medusa-react";
import PurchaseModal from '../app/components/PurchaseModal';

const ProductCardMedusa = ({ product, showDescription = false }) => {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const { addItem } = useCart();

  const handleBuyClick = () => {
    setShowPurchaseModal(true);
  };

  const handleCloseModal = () => {
    setShowPurchaseModal(false);
  };

  const handleAddToCart = async () => {
    try {
      if (product.variants && product.variants.length > 0) {
        await addItem({
          variantId: product.variants[0].id,
          quantity: 1
        });
        console.log('Товар добавлен в корзину');
      } else {
        console.error('Нет доступных вариантов товара');
      }
    } catch (error) {
      console.error('Ошибка добавления в корзину:', error);
    }
  };

  // Функция для получения иконки в зависимости от типа продукта
  const getProductIcon = (productName) => {
    const name = productName.toLowerCase();
    if (name.includes('l-') || name.includes('аминокислот')) {
      return '🧬'; // Иконка ДНК для аминокислот
    } else if (name.includes('кальци') || name.includes('calcium')) {
      return '🦴'; // Иконка кости для кальция
    } else if (name.includes('кали') || name.includes('potassium')) {
      return '💓'; // Иконка сердца для калия
    } else if (name.includes('цинк') || name.includes('zinc')) {
      return '🛡️'; // Иконка щита для цинка
    } else if (name.includes('альгинат') || name.includes('alginate')) {
      return '🌿'; // Иконка растения для альгината
    } else {
      return '💊'; // Общая иконка для добавок
    }
  };

  // Получаем цену из Medusa (в копейках, конвертируем в рубли)
  const getPrice = () => {
    if (product.variants && product.variants[0] && product.variants[0].prices) {
      const price = product.variants[0].prices[0];
      return price ? (price.amount / 100).toLocaleString('ru-RU') : '0';
    }
    return '0';
  };

  return (
    <div className="product-card product-card-clickable">
      {product.badge && <div className="product-badge">{product.badge}</div>}

      {/* Иконка продукта для мобильных */}
      <div className="product-icon-mobile">
        <span className="product-icon">{getProductIcon(product.title)}</span>
      </div>

      <div className="product-image">
        <img
          src={product.thumbnail || product.images?.[0]?.url || '/img/default-product.png'}
          alt={product.title}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain'
          }}
          onError={(e) => {
            console.error('Ошибка загрузки изображения:', product.thumbnail);
            e.target.style.display = 'none';
          }}
        />
      </div>
      
      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-subtitle">{product.subtitle || product.description}</p>
        {showDescription && (
          <p className="product-description">{product.description}</p>
        )}
        
        <div className="product-actions">
          <div className="product-price-quantity">
            <span className="product-price">{getPrice()} ₽</span>
            <span className="product-quantity">
              {product.variants?.[0]?.inventory_quantity || 0} шт
            </span>
          </div>
          
          <div className="action-buttons">
            <button 
              className="btn btn-buy" 
              onClick={handleAddToCart}
              disabled={!product.variants || product.variants.length === 0}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              В корзину
            </button>
            
            <button className="btn btn-buy" onClick={handleBuyClick}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Купить
            </button>
          </div>
        </div>
      </div>

      <PurchaseModal
        isOpen={showPurchaseModal}
        onClose={handleCloseModal}
        product={product}
      />
    </div>
  );
};

export default ProductCardMedusa;

