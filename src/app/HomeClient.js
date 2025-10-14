"use client";

import products from "../data/products";
import reviews from "../data/reviews";
import ProductCard from "../components/ProductCard";
import ReviewCard from "../components/ReviewCard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../contexts/CartContext";
import WhatsAppWidget from "../components/WhatsAppWidget";
import "./styles/pages/home-mobile.css";

export default function HomeClient() {
  const { addToCart } = useCart();

  return (
    <>
      <Header />
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Научные решения<br/>для вашего здоровья</h1>
              <p>Инновационные биологически активные добавки, разработанные на основе последних научных исследований для поддержания оптимального здоровья.</p>
              <div className="hero-actions">
                <a href="/products" className="btn"><i className="fas fa-capsules"></i> Каталог продуктов</a>
                <a href="/about" className="btn btn-outline"><i className="fas fa-users"></i> О нас</a>
              </div>
            </div>
            <div className="hero-image">
              <img src="/img/image_1.jpg" alt="hero image"/>
            </div>
          </div>
        </div>
      </section>

      <section className="products home-products">
        <div className="container">
          <div className="section-title">
            <h2>Наши продукты</h2>
            <p>Премиальные добавки с клинически подтвержденной эффективностью</p>
          </div>
          <div className="product-grid">
            {products.filter(product => ['l-cysteine', 'l-leucine', 'l-proline'].includes(product.id)).map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                handleAddToCart={addToCart}
                showDescription={false}
                priority={true}
              />
            ))}
          </div>
          <div style={{textAlign: 'center', marginTop: '40px'}}>
            <a href="/products" className="btn btn-outline">Все продукты</a>
          </div>
        </div>
      </section>

      <section className="science">
        <div className="container">
          <div className="section-title">
            <h2>Научная основа</h2>
            <p>Наши продукты созданы на основе передовых исследований в области биохимии и нутрициологии</p>
          </div>
          <div className="science-grid">
            <div className="science-card">
              <i className="fas fa-microscope"></i>
              <h3>Молекулярная точность</h3>
              <p>Мы используем только те формы нутриентов, которые имеют наилучшую биодоступность и доказанную эффективность в клинических исследованиях.</p>
            </div>
            <div className="science-card">
              <i className="fas fa-sync-alt"></i>
              <h3>Синергия компонентов</h3>
              <p>Наши формулы разработаны с учетом синергетического взаимодействия компонентов для максимального эффекта.</p>
            </div>
            <div className="science-card">
              <i className="fas fa-book"></i>
              <h3>Доказательная база</h3>
              <p>Каждый ингредиент в составе наших продуктов подкреплен научными публикациями в рецензируемых журналах.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Секция статей */}
      <section className="articles-mini">
        <div className="container">
          <div className="section-title">
            <h2>Полезные статьи</h2>
          </div>
          <div className="articles-mini-grid">
            <a href="/articles/threonine-guide" className="articles-mini-card" aria-label="Треонин — перейти к статье">
              <div className="articles-mini-image">
                <img src="/img/for state_1.png" alt="Треонин — статья"/>
              </div>
              <h3 className="articles-mini-title">Что такое треонин? 7 важных фактов</h3>
            </a>
            <a href="/articles/isoleucine-guide" className="articles-mini-card" aria-label="L-изолейцин — перейти к статье">
              <div className="articles-mini-image">
                <img src="/img/for state_2.png" alt="L-изолейцин — статья"/>
              </div>
              <h3 className="articles-mini-title">L-изолейцин: энергия и восстановление</h3>
            </a>
          </div>
          <div style={{textAlign: 'center', marginTop: '40px'}}>
            <a href="/articles" className="btn btn-outline">Все статьи</a>
          </div>
        </div>
      </section>

      <section className="reviews-section">
        <div className="container">
          <div className="reviews-container">
            <div className="reviews-header">
              <h2>Отзывы наших клиентов</h2>
              <p>Реальные отзывы от людей, которые уже попробовали наши продукты и получили результаты</p>
            </div>
            <div className="reviews-grid">
              {reviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <WhatsAppWidget />
      <Footer />
    </>
  );
}

