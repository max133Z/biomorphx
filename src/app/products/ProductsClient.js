"use client";

import { useState, useEffect } from "react";
import products from "../../data/products";
import ProductCard from "../../components/ProductCard";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useCart } from "../../contexts/CartContext";
import AddToCartModal from "../../components/AddToCartModal";
import FreeDeliveryModal from "../../components/FreeDeliveryModal";
import "../styles/pages/products-mobile.css";

export default function ProductsClient() {
  const { addToCart } = useCart();
  const [modalProduct, setModalProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFreeDeliveryModalOpen, setIsFreeDeliveryModalOpen] = useState(false);

  useEffect(() => {
    // Проверяем URL параметр для сброса флага (для тестирования)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('resetModal') === 'true' || urlParams.get('resetFreeDelivery') === 'true') {
      localStorage.removeItem('hasSeenFreeDeliveryModal');
    }
    
    // Проверяем, показывали ли уже модальное окно о бесплатной доставке
    // Теперь сохраняем timestamp и проверяем, прошло ли 30 минут
    const modalData = localStorage.getItem('hasSeenFreeDeliveryModal');
    const MODAL_COOLDOWN = 30 * 60 * 1000; // 30 минут в миллисекундах
    
    let shouldShowModal = false;
    
    if (!modalData) {
      // Если данных нет, показываем модальное окно
      shouldShowModal = true;
    } else {
      try {
        // Пытаемся распарсить как JSON (новый формат с timestamp)
        const data = JSON.parse(modalData);
        if (data.timestamp) {
          const timeSinceLastShow = Date.now() - data.timestamp;
          // Если прошло больше 30 минут, показываем снова
          if (timeSinceLastShow >= MODAL_COOLDOWN) {
            shouldShowModal = true;
          }
        } else {
          // Старый формат (просто 'true'), показываем модальное окно
          shouldShowModal = true;
        }
      } catch (e) {
        // Если это старый формат (просто строка 'true'), показываем модальное окно
        if (modalData === 'true') {
          shouldShowModal = true;
        }
      }
    }
    
    if (shouldShowModal) {
      // Показываем модальное окно через небольшую задержку для лучшего UX
      const timer = setTimeout(() => {
        setIsFreeDeliveryModalOpen(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseFreeDeliveryModal = () => {
    setIsFreeDeliveryModalOpen(false);
    // Сохраняем в localStorage timestamp текущего времени
    // Это позволит показывать модальное окно снова через 30 минут
    const modalData = {
      timestamp: Date.now()
    };
    localStorage.setItem('hasSeenFreeDeliveryModal', JSON.stringify(modalData));
  };

  return (
    <>
      <Header />

      {/* Hero-секция для страницы продуктов */}
      <section className="products-page-hero">
        <div className="container page-hero-content">
          <h1>Все наши продукты</h1>
          <p>Откройте для себя полный ассортимент инновационных биологически активных добавок.</p>
        </div>
      </section>

      {/* Секция продуктов */}
      <section className="products">
        <div className="container">
          {products && products.length > 0 ? (
            <div className="product-grid products-page-grid">
              {products.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  handleAddToCart={(p) => {
                    setModalProduct(p);
                    setIsModalOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>
              <h2>Продукты не найдены</h2>
              <p>Попробуйте обновить страницу</p>
            </div>
          )}
        </div>
      </section>

      <Footer />

      <AddToCartModal
        isOpen={isModalOpen}
        product={modalProduct}
        onClose={() => setIsModalOpen(false)}
        onContinue={() => {
          if (modalProduct) addToCart(modalProduct);
          setIsModalOpen(false);
        }}
        onCheckout={() => {
          if (modalProduct) addToCart(modalProduct);
          window.location.href = '/checkout';
        }}
      />

      <FreeDeliveryModal
        isOpen={isFreeDeliveryModalOpen}
        onClose={handleCloseFreeDeliveryModal}
      />
    </>
  );
}

