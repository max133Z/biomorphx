"use client";

import React, { useEffect, useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import products from '../../data/products';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';

const CheckoutClient = () => {
  const {
    items,
    getTotalPrice,
    clearCart,
    updateQuantity,
    removeFromCart
  } = useCart();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    deliveryMethod: 'cdek',
    cdekAddress: '',
    postAddress: '',
    postIndex: '',
    expressAddress: '',
    paymentMethod: 'card',
    notes: ''
  });

  const [privacyAgreement, setPrivacyAgreement] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // избегаем hydration mismatch из-за клиентских данных корзины
  }

  // Получаем информацию о товаре
  const getProductInfo = (productId) => {
    return products.find(p => p.id === productId);
  };

  // Обработка изменения полей формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Функции для изменения количества товаров
  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  // Обработка отправки заказа
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.firstName || !formData.phone) {
      alert('Пожалуйста, заполните обязательные поля: Email, Имя и Телефон');
      return;
    }

    // Проверка адреса доставки в зависимости от способа доставки
    if (formData.deliveryMethod === 'cdek' && !formData.cdekAddress) {
      alert('Пожалуйста, укажите адрес пункта выдачи СДЭК');
      return;
    }
    if (formData.deliveryMethod === 'post' && (!formData.postAddress || !formData.postIndex)) {
      alert('Пожалуйста, укажите адрес доставки и почтовый индекс');
      return;
    }
    if (formData.deliveryMethod === 'express' && !formData.expressAddress) {
      alert('Пожалуйста, укажите адрес для экспресс доставки');
      return;
    }

    if (!privacyAgreement) {
      alert('Необходимо согласиться с политикой обработки персональных данных');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.deliveryMethod === 'cdek' ? formData.cdekAddress :
                  formData.deliveryMethod === 'post' ? formData.postAddress :
                  formData.expressAddress,
          postIndex: formData.deliveryMethod === 'post' ? formData.postIndex : null,
          deliveryMethod: formData.deliveryMethod,
          paymentMethod: formData.paymentMethod,
          notes: formData.notes || ''
        },
        items: items.map(item => ({
          productId: item.id,
          title: item.name,
          quantity: item.quantity,
          unitPrice: item.price
        })),
        total: getTotalPrice()
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const result = await response.json();
        clearCart();
        setOrderSuccess(true);
      } else {
        throw new Error('Ошибка при отправке заказа');
      }
    } catch (error) {
      console.error('Ошибка заказа:', error);
      alert('Произошла ошибка при оформлении заказа. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Если корзина пуста, перенаправляем на главную
  if (items.length === 0 && !orderSuccess) {
    return (
      <>
        <Header />
        <section className="page-hero">
          <div className="container">
            <div className="page-hero-content">
              <h1>Оформление заказа</h1>
            </div>
          </div>
        </section>
        <section className="checkout-page">
          <div className="container">
            <div className="empty-checkout">
              <div className="empty-checkout-icon">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <h2>Корзина пуста</h2>
              <p>Добавьте товары в корзину для оформления заказа.</p>
              <Link href="/products" className="btn">
                <i className="fas fa-shopping-bag"></i> Перейти к покупкам
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  // Страница успешного заказа
  if (orderSuccess) {
    return (
      <>
        <Header />
        <section className="page-hero">
          <div className="container">
            <div className="page-hero-content">
              <h1>Заказ оформлен!</h1>
            </div>
          </div>
        </section>
        <section className="checkout-page">
          <div className="container">
            <div className="order-success">
              <div className="success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h2>Спасибо за заказ!</h2>
              <p>Ваш заказ успешно оформлен. Мы свяжемся с вами в ближайшее время для подтверждения.</p>
              <div className="order-details">
                <h3>Детали заказа:</h3>
                <p><strong>Имя:</strong> {formData.firstName} {formData.lastName}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Телефон:</strong> {formData.phone}</p>
                <p><strong>Способ доставки:</strong> {
                  formData.deliveryMethod === 'cdek' ? 'СДЭК' :
                  formData.deliveryMethod === 'post' ? 'Почта России' :
                  'Экспресс доставка по Санкт-Петербургу'
                }</p>
                <p><strong>Способ оплаты:</strong> {
                  formData.paymentMethod === 'cash' ? 'Наличными при получении' :
                  formData.paymentMethod === 'card' ? 'Банковская карта' :
                  'СБП'
                }</p>
                <p><strong>Сумма заказа:</strong> {getTotalPrice()} ₽</p>
              </div>
              <Link href="/" className="btn">
                <i className="fas fa-home"></i> Вернуться на главную
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <section className="page-hero">
        <div className="container">
          <div className="page-hero-content">
            <h1>Оформление заказа</h1>
          </div>
        </div>
      </section>

      <section className="checkout-page">
        <div className="container">
          <div className="checkout-content">
            <div className="checkout-form-section">
              <div className="checkout-form-header">
                <h2>Данные для заказа</h2>
              </div>
              
              <form onSubmit={handleSubmitOrder} className="checkout-form" id="checkout-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">Имя *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Фамилия *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Телефон *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Способ доставки *</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="cdek"
                        checked={formData.deliveryMethod === 'cdek'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-custom"></span>
                      <div className="radio-content">
                        <i className="fas fa-truck"></i>
                        <div>
                          <strong>СДЭК</strong>
                        </div>
                      </div>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="post"
                        checked={formData.deliveryMethod === 'post'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-custom"></span>
                      <div className="radio-content">
                        <i className="fas fa-envelope"></i>
                        <div>
                          <strong>Почта России</strong>
                        </div>
                      </div>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="express"
                        checked={formData.deliveryMethod === 'express'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-custom"></span>
                      <div className="radio-content">
                        <i className="fas fa-motorcycle"></i>
                        <div>
                          <strong>Экспресс доставка по Санкт-Петербургу</strong>
                        </div>
                      </div>
                    </label>
                  </div>
                  
                  <p className="delivery-note">
                    Точную стоимость доставки мы напишем Вам при обработке заказа, она зависит от города
                  </p>
                </div>

                {/* Поля для СДЭК */}
                {formData.deliveryMethod === 'cdek' && (
                  <div className="form-group">
                    <label htmlFor="cdekAddress">Адрес пункта СДЭК *</label>
                    <input
                      type="text"
                      id="cdekAddress"
                      name="cdekAddress"
                      value={formData.cdekAddress}
                      onChange={handleInputChange}
                      required
                      placeholder="Введите адрес пункта выдачи СДЭК"
                    />
                  </div>
                )}

                {/* Поля для Почты России */}
                {formData.deliveryMethod === 'post' && (
                  <>
                    <div className="form-group">
                      <label htmlFor="postAddress">Адрес *</label>
                      <input
                        type="text"
                        id="postAddress"
                        name="postAddress"
                        value={formData.postAddress}
                        onChange={handleInputChange}
                        required
                        placeholder="Введите адрес доставки"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="postIndex">Индекс *</label>
                      <input
                        type="text"
                        id="postIndex"
                        name="postIndex"
                        value={formData.postIndex}
                        onChange={handleInputChange}
                        required
                        placeholder="Введите почтовый индекс"
                      />
                    </div>
                  </>
                )}

                {/* Поля для экспресс доставки */}
                {formData.deliveryMethod === 'express' && (
                  <div className="form-group">
                    <label htmlFor="expressAddress">Адрес *</label>
                    <input
                      type="text"
                      id="expressAddress"
                      name="expressAddress"
                      value={formData.expressAddress}
                      onChange={handleInputChange}
                      required
                      placeholder="Введите адрес доставки в Санкт-Петербурге"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Способ оплаты *</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-custom"></span>
                      <div className="radio-content">
                        <i className="fas fa-credit-card"></i>
                        <div>
                          <strong>Банковская карта</strong>
                        </div>
                      </div>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="sbp"
                        checked={formData.paymentMethod === 'sbp'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-custom"></span>
                      <div className="radio-content">
                        <i className="fas fa-mobile-alt"></i>
                        <div>
                          <strong>СБП</strong>
                        </div>
                      </div>
                    </label>
                    {formData.deliveryMethod === 'express' && (
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash"
                          checked={formData.paymentMethod === 'cash'}
                          onChange={handleInputChange}
                        />
                        <span className="radio-custom"></span>
                        <div className="radio-content">
                          <i className="fas fa-money-bill-wave"></i>
                          <div>
                            <strong>Наличными при получении</strong>
                          </div>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Комментарий к заказу</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Дополнительная информация..."
                  />
                </div>
              </form>
            </div>
            
            <div className="checkout-summary">
              <div className="checkout-summary-header">
                <h3>Ваш заказ</h3>
              </div>
              
              <div className="checkout-items">
                {items.map(item => {
                  const product = getProductInfo(item.id);
                  if (!product) return null;

                  return (
                    <div key={item.id} className="checkout-item">
                      <div className="checkout-item-info">
                        <h4>{product.name}</h4>
                        <p className="checkout-item-description">{product.quantity}</p>
                        <div className="checkout-item-quantity-controls">
                          <button 
                            className="quantity-btn quantity-minus"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          <span className="quantity-display">{item.quantity}</span>
                          <button 
                            className="quantity-btn quantity-plus"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                        <button 
                          className="remove-item-btn"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <i className="fas fa-trash"></i> Удалить
                        </button>
                      </div>
                      <div className="checkout-item-price">
                        {product.price * item.quantity} ₽
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="checkout-summary-content">
                <div className="summary-row">
                  <span>Товары ({items.length})</span>
                  <span>{getTotalPrice()} ₽</span>
                </div>
                
                <div className="summary-total">
                  <span>К оплате</span>
                  <span className="total-price">{getTotalPrice()} ₽</span>
                </div>
              </div>
              
              <div className="checkout-actions">
                <div className="privacy-agreement">
                  <label className="privacy-checkbox">
                    <input
                      type="checkbox"
                      checked={privacyAgreement}
                      onChange={(e) => setPrivacyAgreement(e.target.checked)}
                      required
                    />
                    <span className="checkmark"></span>
                    <span className="privacy-text">
                      Я соглашаюсь с{' '}
                      <a 
                        href="/order-processing-policy" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="privacy-link"
                      >
                        политикой обработки персональных данных
                      </a>
                    </span>
                  </label>
                </div>
                
                <button 
                  type="submit"
                  form="checkout-form"
                  className="submit-order-btn"
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting || !privacyAgreement}
                >
                  <i className="fas fa-check"></i> 
                  {isSubmitting ? 'Оформляем заказ...' : 'Оформить заказ'}
                </button>
                
                <Link href="/products" className="back-to-cart-btn">
                  <i className="fas fa-arrow-left"></i> Продолжить покупки
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
      {showContactModal && (
        <div className="purchase-modal-overlay" onClick={() => setShowContactModal(false)}>
          <div className="purchase-modal" onClick={(e) => e.stopPropagation()}>
            <button className="purchase-modal-close" aria-label="Закрыть" onClick={() => setShowContactModal(false)}>
              <i className="fas fa-times"></i>
            </button>
            <div className="purchase-modal-header">
              <h3 className="purchase-modal-title">Спасибо!</h3>
              <p className="purchase-modal-subtitle">Мы с вами свяжемся для дальнейшей обработки заказа. Спасибо, что выбираете нас.</p>
            </div>
            <div className="purchase-modal-actions">
              <button className="purchase-modal-btn continue" onClick={() => setShowContactModal(false)}>Ок</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CheckoutClient;

