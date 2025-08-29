"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminOrders() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    setIsAuthenticated(true);
    loadOrders();
  }, [router]);

  const loadOrders = async () => {
    try {
      // В реальном проекте здесь будет API запрос
      const mockOrders = [
        {
          id: "ORD-001",
          customer: "Иван Петров",
          email: "ivan@example.com",
          phone: "+7 (999) 123-45-67",
          products: [
            { name: "L-Cysteine (Цистеин)", quantity: 2, price: 800 }
          ],
          total: 1600,
          status: "pending",
          date: "2025-01-20",
          address: "г. Москва, ул. Примерная, д. 1, кв. 1"
        },
        {
          id: "ORD-002",
          customer: "Мария Сидорова",
          email: "maria@example.com",
          phone: "+7 (999) 234-56-78",
          products: [
            { name: "L-Leucine (Лейцин)", quantity: 1, price: 600 },
            { name: "L-Isoleucine (Изолейцин)", quantity: 1, price: 800 }
          ],
          total: 1400,
          status: "shipped",
          date: "2025-01-19",
          address: "г. Санкт-Петербург, ул. Тестовая, д. 2, кв. 5"
        },
        {
          id: "ORD-003",
          customer: "Алексей Козлов",
          email: "alex@example.com",
          phone: "+7 (999) 345-67-89",
          products: [
            { name: "L-Cysteine (Цистеин)", quantity: 3, price: 800 }
          ],
          total: 2400,
          status: "delivered",
          date: "2025-01-18",
          address: "г. Екатеринбург, ул. Пробная, д. 3, кв. 10"
        }
      ];
      setOrders(mockOrders);
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'var(--admin-warning)';
      case 'shipped': return 'var(--admin-info)';
      case 'delivered': return 'var(--admin-success)';
      case 'cancelled': return 'var(--admin-danger)';
      default: return 'var(--admin-text-light)';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Ожидает обработки';
      case 'shipped': return 'Отправлен';
      case 'delivered': return 'Доставлен';
      case 'cancelled': return 'Отменен';
      default: return 'Неизвестно';
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // В реальном проекте здесь будет API запрос
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      alert(`Статус заказа ${orderId} обновлен на "${getStatusText(newStatus)}"`);
    } catch (error) {
      alert('Ошибка при обновлении статуса заказа');
    }
  };

  const filteredOrders = filterStatus === "all" 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  if (!isAuthenticated) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>Управление заказами</h1>
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
            <Link href="/admin/products" className="admin-nav-item">
              <i className="fas fa-capsules"></i>
              <span>Продукты</span>
            </Link>
            <Link href="/admin/orders" className="admin-nav-item active">
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
          <div className="orders-header">
            <div className="orders-stats">
              <div className="stat-item">
                <span className="stat-number">{orders.length}</span>
                <span className="stat-label">Всего заказов</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {orders.filter(o => o.status === 'pending').length}
                </span>
                <span className="stat-label">Ожидают обработки</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {orders.filter(o => o.status === 'shipped').length}
                </span>
                <span className="stat-label">Отправлены</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {orders.filter(o => o.status === 'delivered').length}
                </span>
                <span className="stat-label">Доставлены</span>
              </div>
            </div>

            <div className="orders-filters">
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="status-filter"
              >
                <option value="all">Все заказы</option>
                <option value="pending">Ожидают обработки</option>
                <option value="shipped">Отправлены</option>
                <option value="delivered">Доставлены</option>
                <option value="cancelled">Отменены</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="admin-loading">Загрузка заказов...</div>
          ) : (
            <div className="orders-table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>ID заказа</th>
                    <th>Клиент</th>
                    <th>Продукты</th>
                    <th>Сумма</th>
                    <th>Статус</th>
                    <th>Дата</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id}>
                      <td>
                        <strong>{order.id}</strong>
                      </td>
                      <td>
                        <div className="customer-info">
                          <div className="customer-name">{order.customer}</div>
                          <div className="customer-email">{order.email}</div>
                          <div className="customer-phone">{order.phone}</div>
                        </div>
                      </td>
                      <td>
                        <div className="products-list">
                          {order.products.map((product, index) => (
                            <div key={index} className="product-item">
                              {product.name} × {product.quantity}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td>
                        <strong>{order.total} ₽</strong>
                      </td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(order.status) }}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td>{order.date}</td>
                      <td>
                        <div className="order-actions">
                          <button 
                            className="action-btn view-btn"
                            onClick={() => alert(`Просмотр заказа ${order.id}`)}
                            title="Просмотреть детали"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <select 
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="status-select"
                          >
                            <option value="pending">Ожидает</option>
                            <option value="shipped">Отправлен</option>
                            <option value="delivered">Доставлен</option>
                            <option value="cancelled">Отменен</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredOrders.length === 0 && !isLoading && (
            <div className="empty-state">
              <i className="fas fa-shopping-cart"></i>
              <h3>Заказов не найдено</h3>
              <p>По выбранным фильтрам заказов не найдено</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}


