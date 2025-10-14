"use client";

import { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import ClientOnly from "./ClientOnly";
import TopHeader from "./TopHeader";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { getTotalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {!isScrolled && <TopHeader />}
      <header className={isScrolled ? 'scrolled' : ''}>
        <div className="container header-container">
        <a href="/" className="logo">Bio<span>MorphX</span></a>
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          <i className="fas fa-bars"></i>
        </button>
        {/* Мобильная кнопка корзины в правом верхнем углу */}
        <div className="mobile-cart-top">
          <a href="/checkout" className="mobile-cart-top-link">
            <i className="fas fa-shopping-cart"></i>
            <span className="cart-text">В корзину</span>
            <ClientOnly fallback={<span className="cart-count">0</span>}>
              <span className="cart-count">{getTotalItems()}</span>
            </ClientOnly>
          </a>
        </div>
        <nav>
          <ul className={isMenuOpen ? "show" : ""}>
            <li><a href="/"><i className="fas fa-home"></i> Главная</a></li>
            <li><a href="/products"><i className="fas fa-capsules"></i> Продукты</a></li>
            <li><a href="/delivery">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 8H17V4H3C1.9 4 1 4.9 1 6V17H3C3 18.66 4.34 20 6 20C7.66 20 9 18.66 9 17H15C15 18.66 16.34 20 18 20C19.66 20 21 18.66 21 17H23V12L20 8ZM6 18.5C5.17 18.5 4.5 17.83 4.5 17C4.5 16.17 5.17 15.5 6 15.5C6.83 15.5 7.5 16.17 7.5 17C7.5 17.83 6.83 18.5 6 18.5ZM18 18.5C17.17 18.5 16.5 17.83 16.5 17C16.5 16.17 17.17 15.5 18 15.5C18.83 15.5 19.5 16.17 19.5 17C19.5 17.83 18.83 18.5 18 18.5ZM17 12V9.5H19.5L21.46 12H17Z"/>
              </svg>
              Доставка
            </a></li>
            <li><a href="/about"><i className="fas fa-users"></i> О нас</a></li>
            <li><a href="/contact"><i className="fas fa-envelope"></i> Контакты</a></li>
            <li className="cart-icon">
              <a href="/checkout" className="cart-link">
                <i className="fas fa-shopping-cart"></i>
                <ClientOnly fallback={<span className="cart-count">0</span>}>
                  <span className="cart-count">{getTotalItems()}</span>
                </ClientOnly>
              </a>
            </li>
          </ul>
        </nav>
        </div>
      </header>
    </>
  );
};

export default Header;


