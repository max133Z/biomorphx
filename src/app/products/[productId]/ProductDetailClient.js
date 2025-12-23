"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import ImageModal from "../../../components/ImageModal";
import AddToCartModal from "../../../components/AddToCartModal";
import { useCart } from "../../../contexts/CartContext";

// Маппинг продуктов к статьям
const getRelatedArticle = (productId) => {
  const articleMap = {
    "l-threonine": {
      slug: "threonine-guide",
      title: "Что такое треонин? 7 важных фактов",
      image: "/img/articles_img/threonine.webp",
    },
    "l-proline": {
      slug: "proline-guide",
      title: "Роль пролина в организме: почему эта аминокислота важна для здоровья",
      image: "/img/articles_img/proline.webp",
    },
    "l-valine": {
      slug: "valine-guide",
      title: "Валин: полный гид по применению для спортсменов 2025",
      image: "/img/articles_img/valine.webp",
    },
    "l-leucine": {
      slug: "leucine-guide",
      title: "Лейцин: влияние на синтез белка и метаболизм мышц",
      image: "/img/articles_img/leucine.webp",
    },
    "l-isoleucine": {
      slug: "isoleucine-guide",
      title: "Изолейцин: энергия и восстановление",
      image: "/img/articles_img/isoleucine.webp",
    },
    "calcium-d-gluconate": {
      slug: "calcium-gluconate-guide",
      title: "Кальция глюконат: полное руководство по применению, питанию и безопасности",
      image: "/img/articles_img/calcium-gluconate.webp",
    },
  };
  
  return articleMap[productId] || null;
};

export default function ProductDetailClient({ product }) {
  const { addToCart } = useCart();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isAddToCartModalOpen, setIsAddToCartModalOpen] = useState(false);
  const relatedArticle = product ? getRelatedArticle(product.id) : null;

  const handleAddToCart = () => {
    if (product) {
      setIsAddToCartModalOpen(true);
    }
  };

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
              <button className="btn" onClick={handleAddToCart}>
                <i className="fas fa-cart-plus"></i> Добавить в корзину
              </button>
            </div>
          </div>
        </div>
      </section>

      {relatedArticle && (
        <section className="product-related-article">
          <div className="container">
            <div className="related-article-card">
              <div className="related-article-content">
                <h2>Полезная статья</h2>
                <p>Узнайте больше о применении и пользе этого продукта</p>
                <Link href={`/articles/${relatedArticle.slug}`} className="related-article-link">
                  <div className="related-article-image">
                    <img src={relatedArticle.image} alt={relatedArticle.title} />
                  </div>
                  <div className="related-article-info">
                    <h3>{relatedArticle.title}</h3>
                    <span className="related-article-read-more">
                      Читать статью <i className="fas fa-arrow-right"></i>
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
      
      <ImageModal
        isOpen={isImageModalOpen}
        imageSrc={product.image}
        imageAlt={product.name}
        onClose={() => setIsImageModalOpen(false)}
      />

      <AddToCartModal
        isOpen={isAddToCartModalOpen}
        product={product}
        onClose={() => setIsAddToCartModalOpen(false)}
        onContinue={() => {
          if (product) addToCart(product);
          setIsAddToCartModalOpen(false);
        }}
        onCheckout={() => {
          if (product) addToCart(product);
          setIsAddToCartModalOpen(false);
          window.location.href = '/checkout';
        }}
      />
    </>
  );
}

