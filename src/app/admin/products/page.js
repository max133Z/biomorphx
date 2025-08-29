"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Импорты стилей админ панели
import "../../styles/admin/admin-base.css";
import "../../styles/admin/admin-dashboard.css";
import "../../styles/admin/admin-products.css";
import "../../styles/admin/admin-forms.css";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Проверяем аутентификацию
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    setIsAuthenticated(true);
    
    // Загружаем продукты
    loadProducts();
  }, [router]);

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Ошибка при загрузке продуктов');
      }
      const productsData = await response.json();
      setProducts(productsData);
    } catch (error) {
      console.error('Ошибка загрузки продуктов:', error);
      alert('Ошибка при загрузке продуктов');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (confirm('Вы уверены, что хотите удалить этот продукт?')) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Ошибка при удалении продукта');
        }

        // Обновляем список продуктов
        setProducts(products.filter(p => p.id !== productId));
        alert('Продукт успешно удален');
      } catch (error) {
        alert(error.message || 'Ошибка при удалении продукта');
      }
    }
  };

  if (!isAuthenticated) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>Управление продуктами</h1>
          <Link href="/admin/dashboard" className="admin-back-btn">
            <i className="fas fa-arrow-left"></i> Назад
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
          <div className="admin-header-actions">
            <h2>Список продуктов</h2>
            <div className="admin-actions-buttons">
              <button 
                onClick={loadProducts} 
                className="admin-refresh-btn"
                disabled={isLoading}
              >
                <i className="fas fa-sync-alt"></i> Обновить
              </button>
              <Link href="/admin/products/new" className="admin-add-btn">
                <i className="fas fa-plus"></i> Добавить продукт
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="admin-loading">Загрузка продуктов...</div>
          ) : (
            <div className="admin-products-grid">
              {products.map(product => (
                <div key={product.id} className="admin-product-card">
                  <div className="admin-product-image">
                    <img src={product.image} alt={product.name} />
                    {product.badge && (
                      <span className="admin-product-badge">{product.badge}</span>
                    )}
                  </div>
                  
                                     <div className="admin-product-info">
                     <h3>{product.name}</h3>
                     <p className="admin-product-subtitle">{product.subtitle}</p>
                     <div className="admin-product-meta">
                       <span className="admin-product-price">{product.price} ₽</span>
                       <span className="admin-product-quantity">{product.quantity}</span>
                     </div>
                     <div className="admin-product-status">
                       {product.isMainTop && (
                         <span className="status-badge main-top">Главный топ</span>
                       )}
                       {product.isTopProduct && !product.isMainTop && (
                         <span className="status-badge top-product">Топ продукт</span>
                       )}
                     </div>
                   </div>
                  
                  <div className="admin-product-actions">
                    <Link 
                      href={`/admin/products/edit/${product.id}`} 
                      className="admin-edit-btn"
                    >
                      <i className="fas fa-edit"></i> Редактировать
                    </Link>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="admin-delete-btn"
                    >
                      <i className="fas fa-trash"></i> Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
