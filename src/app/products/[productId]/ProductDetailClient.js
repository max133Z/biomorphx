"use client";

import { useState } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import ImageModal from "../../../components/ImageModal";
import { useCart } from "../../../contexts/CartContext";

export default function ProductDetailClient({ product }) {
  const { addToCart } = useCart();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  if (!product) {
    return (
      <>
        <Header />
        <div className="container" style={{paddingTop: '200px', textAlign: 'center'}}>
          <h1>Продукт не найден</h1>
          <p>К сожалению, продукт не найден.</p>
          <a href="/products" className="btn" style={{marginTop: '20px'}}>Вернуться к продуктам</a>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <section className="product-detail-section">
        <div className="container product-detail-container">
          <div className="product-detail-image">
            <img 
              src={product.image} 
              alt={product.name} 
              onClick={() => setIsImageModalOpen(true)}
              className="product-detail-image-clickable"
            />
            <div className="image-zoom-hint">
              <i className="fas fa-search-plus"></i>
              <span>Нажмите для увеличения</span>
            </div>
          </div>
          <div className="product-detail-content">
            <h1>{product.name}</h1>
            <p className="product-detail-long-description">{product.longDescription}</p>

            {product.recommendedUse && (
              <div className="product-recommended-use">
                <p>{product.recommendedUse}</p>
              </div>
            )}

            {product.keyBenefits && (
              <div className="product-key-benefits">
                <h3>Ключевые преимущества:</h3>
                <ul>
                  {product.keyBenefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}

            {product.recommendedDose && (
              <div className="product-recommendations">
                <h3>Рекомендуемая доза:</h3>
                <p>{product.recommendedDose}</p>
              </div>
            )}

            <div className="featured-highlights product-detail-highlights">
              {product.highlights.map((highlight, index) => (
                <div key={index} className="highlight-item">
                  <div className="highlight-icon">
                    <i className={highlight.icon}></i>
                  </div>
                  <div className="highlight-text">
                    <h4>{highlight.text}</h4>
                  </div>
                </div>
              ))}
            </div>

            <div className="product-price-quantity">
              <span className="product-price">{product.price} ₽</span>
              <span className="product-quantity">{product.quantity}</span>
            </div>

            <div className="add-to-cart">
              <button className="btn" onClick={() => addToCart(product)}>
                <i className="fas fa-cart-plus"></i> Добавить в корзину
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      <ImageModal
        isOpen={isImageModalOpen}
        imageSrc={product.image}
        imageAlt={product.name}
        onClose={() => setIsImageModalOpen(false)}
      />
    </>
  );
}

