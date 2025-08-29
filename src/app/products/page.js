"use client";

import { useState } from "react";
import products from "../../data/products"; // Импортируем данные о продуктах
import ProductCard from "../../components/ProductCard"; // Импортируем компонент ProductCard
import Header from "../../components/Header"; // Импортируем компонент Header
import Footer from "../../components/Footer"; // Импортируем компонент Footer
import { useCart } from "../../contexts/CartContext";

export default function ProductsPage() {
  const { addToCart } = useCart();

  // Отладочная информация
  console.log('Products page loaded');
  console.log('Products data:', products);
  console.log('Products count:', products.length);

  return (
    <>
      <Header />

      {/* Hero-секция для страницы продуктов - упрощенная версия */}
      <section className="products-page-hero">
        <div className="container page-hero-content">
          <h1>Все наши продукты</h1>
          <p>Откройте для себя полный ассортимент инновационных биологически активных добавок.</p>
        </div>
      </section>

      {/* Секция продуктов, использующая динамический рендеринг */}
      <section className="products">
        <div className="container">
          {products && products.length > 0 ? (
                      <div className="product-grid products-page-grid">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                handleAddToCart={addToCart}
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
    </>
  );
}
