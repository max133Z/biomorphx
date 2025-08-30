"use client";

import OptimizedImage from './OptimizedImage';

// router не нужен для карточки, действие делегируем через handleAddToCart

const ProductCard = ({ product, handleAddToCart, showDescription = false }) => {
  

  const handleBuyClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // На странице продуктов мы перехватываем handleAddToCart, чтобы показать модалку
    // На других страницах поведение может быть другим
    handleAddToCart(product);
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

  return (
    <a href={`/products/${product.id}`} className="product-card product-card-clickable">
      {product.badge && <div className="product-badge">{product.badge}</div>}
      
      {/* Иконка продукта для мобильных */}
      <div className="product-icon-mobile">
        <span className="product-icon">{getProductIcon(product.name)}</span>
      </div>
      
      <div className="product-image">
        <OptimizedImage 
          src={product.image} 
          alt={product.name}
          style={{ 
            maxWidth: '100%', 
            maxHeight: '100%', 
            objectFit: 'contain' 
          }}
          fallbackIcon={getProductIcon(product.name)}
        />
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-subtitle">{product.subtitle}</p>
        {showDescription && (
          <p className="product-description">{product.longDescription}</p>
        )}
        <div className="product-actions">
          <div className="product-price-quantity">
            <span className="product-price">{product.price} ₽</span>
            <span className="product-quantity">
              <i className="fas fa-capsules"></i> {product.quantity}
            </span>
          </div>
          <div className="action-buttons">
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
    </a>
  );
};

export default ProductCard;
