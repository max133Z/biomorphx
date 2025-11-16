"use client";

import { useState } from "react";
import products from "../../data/products";
import ProductCard from "../../components/ProductCard";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useCart } from "../../contexts/CartContext";
import AddToCartModal from "../../components/AddToCartModal";
import "../styles/pages/products-mobile.css";

export default function ProductsClient() {
  const { addToCart } = useCart();
  const [modalProduct, setModalProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    </>
  );
}

