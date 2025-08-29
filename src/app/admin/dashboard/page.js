"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Импорты стилей админ панели
import "../../styles/admin/admin-base.css";
import "../../styles/admin/admin-dashboard.css";
import "../../styles/admin/admin-products.css";
import "../../styles/admin/admin-forms.css";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState({
    products: 3,
    orders: 0,
    revenue: 0,
    visitors: 0
  });
  const router = useRouter();

  useEffect(() => {
    // Проверяем аутентификацию
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  if (!isAuthenticated) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>BioMorphX - Админ-панель</h1>
          <button onClick={handleLogout} className="admin-logout-btn">
            <i className="fas fa-sign-out-alt"></i> Выйти
          </button>
        </div>
      </header>

      <div className="admin-container">
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <Link href="/admin/dashboard" className="admin-nav-item active">
              <i className="fas fa-tachometer-alt"></i>
              <span>Панель управления</span>
            </Link>
            <Link href="/admin/products" className="admin-nav-item">
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
          <div className="admin-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-capsules"></i>
              </div>
              <div className="stat-content">
                <h3>{stats.products}</h3>
                <p>Продуктов</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <div className="stat-content">
                <h3>{stats.orders}</h3>
                <p>Заказов</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-ruble-sign"></i>
              </div>
              <div className="stat-content">
                <h3>{stats.revenue} ₽</h3>
                <p>Выручка</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-content">
                <h3>{stats.visitors}</h3>
                <p>Посетителей</p>
              </div>
            </div>
          </div>

          <div className="admin-actions">
            <h2>Быстрые действия</h2>
            <div className="action-grid">
              <Link href="/admin/products/new" className="action-card">
                <i className="fas fa-plus"></i>
                <h3>Добавить продукт</h3>
                <p>Создать новый продукт в каталоге</p>
              </Link>
              
              <Link href="/admin/content/edit" className="action-card">
                <i className="fas fa-edit"></i>
                <h3>Редактировать контент</h3>
                <p>Изменить текст на страницах</p>
              </Link>
              
              <Link href="/admin/orders" className="action-card">
                <i className="fas fa-list"></i>
                <h3>Просмотр заказов</h3>
                <p>Управление заказами клиентов</p>
              </Link>
              
              <Link href="/" className="action-card">
                <i className="fas fa-external-link-alt"></i>
                <h3>Посмотреть сайт</h3>
                <p>Открыть сайт в новой вкладке</p>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


