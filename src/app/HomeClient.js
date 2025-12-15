"use client";

import { useState, useEffect } from "react";
import products from "../data/products";
import reviews from "../data/reviews";
import ProductCard from "../components/ProductCard";
import ReviewCard from "../components/ReviewCard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../contexts/CartContext";
import WhatsAppWidget from "../components/WhatsAppWidget";
import "./styles/pages/home-mobile.css";

function ArticlesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const articles = [
    {
      id: 'calcium-gluconate',
      href: '/articles/calcium-gluconate-guide',
      image: '/img/for _state5.png',
      title: 'Кальция глюконат: полное руководство по применению, питанию и безопасности',
      ariaLabel: 'Кальция глюконат — перейти к статье'
    },
    {
      id: 'proline',
      href: '/articles/proline-guide',
      image: '/img/for state_4.png',
      title: 'Роль пролина в организме: почему эта аминокислота важна для здоровья',
      ariaLabel: 'Пролин — перейти к статье'
    },
    {
      id: 'valine',
      href: '/articles/valine-guide',
      image: '/img/for state_3.png',
      title: 'Валин: полный гид по применению для спортсменов 2025',
      ariaLabel: 'Валин — перейти к статье'
    },
    {
      id: 'leucine',
      href: '/articles/leucine-guide',
      image: '/img/leucine_st.png',
      title: 'Лейцин: влияние на синтез белка и метаболизм мышц',
      ariaLabel: 'Лейцин — перейти к статье'
    },
    {
      id: 'threonine',
      href: '/articles/threonine-guide',
      image: '/img/for state_1.png',
      title: 'Что такое треонин? 7 важных фактов',
      ariaLabel: 'Треонин — перейти к статье'
    },
    {
      id: 'isoleucine',
      href: '/articles/isoleucine-guide',
      image: '/img/for state_2.png',
      title: 'Изолейцин: энергия и восстановление',
      ariaLabel: 'Изолейцин — перейти к статье'
    }
  ];

  // Определяем количество видимых карточек в зависимости от ширины экрана
  const [visibleCards, setVisibleCards] = useState(2);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setVisibleCards(1); // На мобильных показываем 1 карточку
      } else {
        setVisibleCards(2); // На десктопе показываем 2 карточки
      }
    };
    
    handleResize(); // Проверяем при монтировании
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const maxIndex = Math.max(0, articles.length - visibleCards);

  const nextSlide = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Предотвращение скролла страницы при взаимодействии с каруселью
  const handleTouchStart = (e) => {
    e.stopPropagation();
  };

  const handleTouchMove = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="articles-carousel-wrapper">
      <div className="articles-carousel-container">
        <button 
          className="carousel-arrow carousel-arrow-left" 
          onClick={prevSlide}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          aria-label="Предыдущие статьи"
          type="button"
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        
        <div 
          className="articles-carousel"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <div 
            className="articles-carousel-track" 
            style={{ transform: `translateX(-${currentIndex * (100 / visibleCards)}%)` }}
          >
            {articles.map((article) => (
              <a 
                key={article.id}
                href={article.href} 
                className="articles-mini-card" 
                aria-label={article.ariaLabel}
              >
                <div className="articles-mini-image">
                  <img src={article.image} alt={article.title}/>
                </div>
                <h3 className="articles-mini-title">{article.title}</h3>
              </a>
            ))}
          </div>
        </div>
        
        <button 
          className="carousel-arrow carousel-arrow-right" 
          onClick={nextSlide}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          aria-label="Следующие статьи"
          type="button"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
      
      <div className="carousel-dots">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrentIndex(index);
            }}
            onTouchStart={handleTouchStart}
            aria-label={`Перейти к слайду ${index + 1}`}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}

export default function HomeClient() {
  const { addToCart } = useCart();

  return (
    <>
      <Header />
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Простой метод повседневных изменений</h1>
              <p>BIOMORPH это планомерное развитие вашей собственной функциональности и способности действовать.</p>
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
            <p>Аутентичное представление хорошо известных и совсем новых добавок здорового человека.</p>
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
          <ArticlesCarousel />
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

