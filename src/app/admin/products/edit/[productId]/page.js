"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from 'next/image';

// Импорты стилей админ панели
import "../../../../styles/admin/admin-base.css";
import "../../../../styles/admin/admin-dashboard.css";
import "../../../../styles/admin/admin-products.css";
import "../../../../styles/admin/admin-forms.css";

export default function EditProduct() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [activeTab, setActiveTab] = useState('form');
  const [formData, setFormData] = useState({
    name: "",
    subtitle: "",
    longDescription: "",
    price: "",
    quantity: "",
    image: "",
    badge: "",
    isTopProduct: false,
    isMainTop: false,
    highlights: [
      { icon: "fas fa-shield-alt", text: "" },
      { icon: "fas fa-microscope", text: "" },
      { icon: "fas fa-lungs", text: "" },
      { icon: "fas fa-spa", text: "" }
    ]
  });
  const router = useRouter();
  const params = useParams();
  const productId = params.productId;

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    setIsAuthenticated(true);
    loadProduct();
  }, [router, productId]);

  const loadProduct = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Ошибка при загрузке продуктов');
      }
      const products = await response.json();
      const product = products.find(p => p.id === productId);
      
      if (!product) {
        alert('Продукт не найден');
        router.push("/admin/products");
        return;
      }

      setFormData({
        name: product.name || "",
        subtitle: product.subtitle || "",
        longDescription: product.longDescription || "",
        price: product.price || "",
        quantity: product.quantity || "",
        image: product.image || "",
        badge: product.badge || "",
        isTopProduct: product.isTopProduct || false,
        isMainTop: product.isMainTop || false,
        highlights: product.highlights || [
          { icon: "fas fa-shield-alt", text: "" },
          { icon: "fas fa-microscope", text: "" },
          { icon: "fas fa-lungs", text: "" },
          { icon: "fas fa-spa", text: "" }
        ]
      });
    } catch (error) {
      console.error('Ошибка загрузки продукта:', error);
      alert('Ошибка при загрузке продукта');
    } finally {
      setIsLoadingProduct(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleHighlightChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.map((highlight, i) => 
        i === index ? { ...highlight, [field]: value } : highlight
      )
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.name.trim()) {
      errors.push('Название продукта обязательно');
    }
    
    if (!formData.price || formData.price <= 0) {
      errors.push('Цена должна быть больше 0');
    }
    
    if (!formData.image.trim()) {
      errors.push('Путь к изображению обязателен');
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидация формы
    const errors = validateForm();
    if (errors.length > 0) {
      alert('Ошибки в форме:\n' + errors.join('\n'));
      return;
    }
    
    setIsLoading(true);

    try {
      // Отправляем данные на API для обновления
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при обновлении продукта');
      }

      const updatedProduct = await response.json();
      
      // Показываем уведомление об успехе
      const successMessage = `Продукт "${formData.name}" успешно обновлен!`;
      alert(successMessage);
      
      // Перенаправляем на страницу продуктов
      router.push("/admin/products");
    } catch (error) {
      alert(error.message || "Ошибка при обновлении продукта");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div>Загрузка...</div>;
  }

  if (isLoadingProduct) {
    return (
      <div className="admin-dashboard">
        <div className="admin-loading">Загрузка продукта...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>Редактировать продукт</h1>
          <Link href="/admin/products" className="admin-back-btn">
            <i className="fas fa-arrow-left"></i> Назад к продуктам
          </Link>
        </div>
      </header>

      <div className="admin-container">
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <Link href="/admin/dashboard" className="admin-nav-item">
              <i className="fas fa-tachometer-alt"></i>
              <span>Панель управления</span>
            </Link>
            <Link href="/admin/products" className="admin-nav-item active">
              <i className="fas fa-capsules"></i>
              <span>Продукты</span>
            </Link>
            <Link href="/admin/orders" className="admin-nav-item">
              <i className="fas fa-shopping-cart"></i>
              <span>Заказы</span>
            </Link>
            <Link href="/admin/content" className="admin-nav-item">
              <i className="fas fa-edit"></i>
              <span>Контент</span>
            </Link>
            <Link href="/admin/settings" className="admin-nav-item">
              <i className="fas fa-cog"></i>
              <span>Настройки</span>
            </Link>
          </nav>
        </aside>

        <main className="admin-main">
          <div className="product-editor-container">
            {/* Вкладки */}
            <div className="editor-tabs">
              <button 
                className={`editor-tab ${activeTab === 'form' ? 'active' : ''}`}
                onClick={() => setActiveTab('form')}
              >
                <i className="fas fa-edit"></i>
                Редактирование
              </button>
              <button 
                className={`editor-tab ${activeTab === 'preview' ? 'active' : ''}`}
                onClick={() => setActiveTab('preview')}
              >
                <i className="fas fa-eye"></i>
                Предварительный просмотр
              </button>
            </div>

            {/* Форма редактирования */}
            {activeTab === 'form' && (
              <div className="editor-form-section">
                <form onSubmit={handleSubmit} className="product-editor-form">
                  <div className="form-grid">
                    {/* Левая колонка - основная информация */}
                    <div className="form-column">
                      <div className="form-card">
                        <h3><i className="fas fa-info-circle"></i> Основная информация</h3>
                        
                        <div className="form-group">
                          <label htmlFor="name">Название продукта *</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            placeholder="Например: L-Cysteine (Цистеин)"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="subtitle">Подзаголовок</label>
                          <input
                            type="text"
                            id="subtitle"
                            name="subtitle"
                            value={formData.subtitle}
                            onChange={handleInputChange}
                            placeholder="Например: Детокс и восстановление клеток"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="longDescription">Подробное описание</label>
                          <textarea
                            id="longDescription"
                            name="longDescription"
                            value={formData.longDescription}
                            onChange={handleInputChange}
                            rows="4"
                            placeholder="Подробное описание продукта..."
                          />
                        </div>
                      </div>

                      <div className="form-card">
                        <h3><i className="fas fa-tag"></i> Цена и количество</h3>
                        
                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="price">Цена (₽) *</label>
                            <input
                              type="number"
                              id="price"
                              name="price"
                              value={formData.price}
                              onChange={handleInputChange}
                              required
                              min="0"
                              placeholder="800"
                            />
                          </div>

                          <div className="form-group">
                            <label htmlFor="quantity">Количество</label>
                            <input
                              type="text"
                              id="quantity"
                              name="quantity"
                              value={formData.quantity}
                              onChange={handleInputChange}
                              placeholder="60 капсул 400 мг."
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Правая колонка - изображение и настройки */}
                    <div className="form-column">
                      <div className="form-card">
                        <h3><i className="fas fa-image"></i> Изображение и бейдж</h3>
                        
                        <div className="form-group">
                          <label htmlFor="image">Путь к изображению</label>
                          <input
                            type="text"
                            id="image"
                            name="image"
                            value={formData.image}
                            onChange={handleInputChange}
                            placeholder="/img/product-image.png"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="badge">Бейдж (опционально)</label>
                          <select
                            id="badge"
                            name="badge"
                            value={formData.badge}
                            onChange={handleInputChange}
                          >
                            <option value="">Нет бейджа</option>
                            <option value="Хит продаж">Хит продаж</option>
                            <option value="Новинка">Новинка</option>
                            <option value="Акция">Акция</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label className="checkbox-label">
                            <input
                              type="checkbox"
                              name="isTopProduct"
                              checked={formData.isTopProduct}
                              onChange={handleInputChange}
                            />
                            <span>Топ продукт (показывается на главной странице)</span>
                          </label>
                        </div>

                        <div className="form-group">
                          <label className="checkbox-label">
                            <input
                              type="checkbox"
                              name="isMainTop"
                              checked={formData.isMainTop}
                              onChange={handleInputChange}
                              disabled={!formData.isTopProduct}
                            />
                            <span>Главный топ продукт (показывается первым с характеристиками)</span>
                          </label>
                        </div>
                      </div>

                      <div className="form-card">
                        <h3><i className="fas fa-star"></i> Особенности продукта</h3>
                        <p className="form-help">Добавьте до 4 ключевых особенностей продукта</p>
                        
                        {formData.highlights.map((highlight, index) => (
                          <div key={index} className="highlight-form-group">
                            <div className="form-row">
                              <div className="form-group">
                                <label>Иконка {index + 1}</label>
                                <select
                                  value={highlight.icon}
                                  onChange={(e) => handleHighlightChange(index, 'icon', e.target.value)}
                                >
                                  <option value="fas fa-shield-alt">Щит (защита)</option>
                                  <option value="fas fa-microscope">Микроскоп (наука)</option>
                                  <option value="fas fa-lungs">Легкие (дыхание)</option>
                                  <option value="fas fa-spa">Спа (красота)</option>
                                  <option value="fas fa-dna">ДНК (генетика)</option>
                                  <option value="fas fa-running">Бег (выносливость)</option>
                                  <option value="fas fa-fire">Огонь (энергия)</option>
                                  <option value="fas fa-leaf">Лист (натуральность)</option>
                                </select>
                              </div>
                                                             <div className="form-group">
                                 <label>Текст {index + 1}</label>
                                 <textarea
                                   value={highlight.text}
                                   onChange={(e) => handleHighlightChange(index, 'text', e.target.value)}
                                   placeholder="Описание особенности"
                                   rows="3"
                                   style={{ resize: 'vertical', minHeight: '80px' }}
                                 />
                               </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button" 
                      onClick={() => router.push("/admin/products")}
                      className="admin-cancel-btn"
                    >
                      Отмена
                    </button>
                    <button 
                      type="submit" 
                      className="admin-save-btn"
                      disabled={isLoading}
                    >
                      {isLoading ? "Сохранение..." : "Обновить продукт"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Предварительный просмотр */}
            {activeTab === 'preview' && (
              <div className="preview-section">
                <div className="preview-container">
                  <h3>Как будет выглядеть карточка товара:</h3>
                  
                  <div className="product-card-preview">
                    {formData.badge && <div className="product-badge">{formData.badge}</div>}
                    <div className="product-image">
                      {formData.image ? (
                        <Image
                          src={formData.image}
                          alt={formData.name || "Предварительный просмотр"}
                          width={300}
                          height={200}
                          style={{ objectFit: 'contain' }}
                        />
                      ) : (
                        <div className="image-placeholder">
                          <i className="fas fa-image"></i>
                          <span>Изображение не выбрано</span>
                        </div>
                      )}
                    </div>
                    <div className="product-info">
                      <h3 className="product-title">{formData.name || "Название продукта"}</h3>
                      <p className="product-subtitle">{formData.subtitle || "Подзаголовок продукта"}</p>
                      <div className="product-meta">
                        <span className="product-price">{formData.price ? `${formData.price} ₽` : "Цена"}</span>
                        <span className="product-quantity">
                          <i className="fas fa-capsules"></i> {formData.quantity || "Количество"}
                        </span>
                      </div>
                      <div className="product-actions">
                        <button type="button" className="btn btn-sm btn-details" disabled>
                          <i className="fas fa-info-circle"></i> Подробнее
                        </button>
                        <button type="button" className="btn btn-sm" disabled>
                          <i className="fas fa-cart-plus"></i> Купить
                        </button>
                      </div>
                    </div>
                  </div>

                                     {/* Предварительный просмотр главного топ продукта */}
                   {formData.isMainTop && (
                     <div className="main-top-preview">
                       <h3>Как будет выглядеть главный топ продукт на главной странице:</h3>
                       <div className="featured-product-preview">
                         <div className="featured-product-image">
                           {formData.image ? (
                             <Image
                               src={formData.image}
                               alt={formData.name || "Главный топ продукт"}
                               width={400}
                               height={300}
                               style={{ objectFit: 'contain' }}
                             />
                           ) : (
                             <div className="image-placeholder large">
                               <i className="fas fa-image"></i>
                               <span>Изображение не выбрано</span>
                             </div>
                           )}
                         </div>
                         <div className="featured-product-content">
                           <h2>{formData.name || "Название продукта"}</h2>
                           <p>{formData.subtitle || "Подзаголовок продукта"}</p>
                           <div className="featured-product-price">{formData.price ? `${formData.price} ₽` : "Цена"}</div>
                           <div className="featured-product-highlights">
                             {formData.highlights.map((highlight, index) => (
                               highlight.text && (
                                 <div key={index} className="highlight-item">
                                   <i className={highlight.icon}></i>
                                   <span>{highlight.text}</span>
                                 </div>
                               )
                             ))}
                           </div>
                         </div>
                       </div>
                     </div>
                   )}

                   {/* Предварительный просмотр страницы "Подробнее" */}
                   <div className="product-detail-preview">
                     <h3>Как будет выглядеть страница "Подробнее":</h3>
                     <div className="product-detail-preview-content">
                       <div className="product-detail-container">
                         <div className="product-detail-image">
                           {formData.image ? (
                             <Image
                               src={formData.image}
                               alt={formData.name || "Детали продукта"}
                               width={350}
                               height={450}
                               style={{ objectFit: 'contain' }}
                             />
                           ) : (
                             <div className="image-placeholder detail">
                               <i className="fas fa-image"></i>
                               <span>Изображение не выбрано</span>
                             </div>
                           )}
                         </div>
                         <div className="product-detail-content">
                           <h1>{formData.name || "Название продукта"}</h1>
                           <p className="product-detail-subtitle">{formData.subtitle || "Подзаголовок продукта"}</p>
                           <p className="product-detail-long-description">
                             {formData.longDescription || "Подробное описание продукта будет отображаться здесь..."}
                           </p>

                           <div className="featured-highlights product-detail-highlights">
                             {formData.highlights.map((highlight, index) => (
                               highlight.text && (
                                 <div key={index} className="highlight-item">
                                   <div className="highlight-icon">
                                     <i className={highlight.icon}></i>
                                   </div>
                                   <div className="highlight-text">
                                     <h4>{highlight.text}</h4>
                                   </div>
                                 </div>
                               )
                             ))}
                           </div>

                           <div className="product-meta">
                             <span className="product-price">{formData.price ? `${formData.price} ₽` : "Цена"}</span>
                             <span className="product-quantity">
                               <i className="fas fa-capsules"></i> {formData.quantity || "Количество"}
                             </span>
                           </div>

                           <div className="add-to-cart">
                             <button className="btn">
                               <i className="fas fa-cart-plus"></i> Добавить в корзину
                             </button>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
