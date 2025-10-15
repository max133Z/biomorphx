"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../styles/admin/admin-panel.css';

// Note: metadata для admin будет в layout.tsx, так как это Client Component

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState([]);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');
  const [emailStatus, setEmailStatus] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Проверяем авторизацию при загрузке страницы
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      if (response.ok) {
        setIsAuthenticated(true);
        fetchOrders();
        fetchEmails();
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      alert('Пожалуйста, заполните все поля');
      return;
    }
    
    setLoading(true);
    
    try {
      // Создаем Basic Auth header
      const credentials = btoa(`${username}:${password}`);
      
      const response = await fetch('/api/admin/orders', {
        headers: {
          'Authorization': `Basic ${credentials}`
        }
      });
      
      if (response.ok) {
        setIsAuthenticated(true);
        fetchOrders();
        fetchEmails();
      } else {
        alert('Неверные учетные данные');
        setUsername('');
        setPassword('');
      }
    } catch (error) {
      alert('Ошибка авторизации. Попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setOrders([]);
    setEmails([]);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      console.log('🔍 Админ: Запрашиваем заказы...');
      
      // Используем сохраненные учетные данные для авторизации
      const credentials = btoa(`${username}:${password}`);
      const response = await fetch('/api/admin/orders', {
        headers: {
          'Authorization': `Basic ${credentials}`
        }
      });
      console.log('📊 Админ: Статус ответа:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📋 Админ: Получены данные:', data);
        
        if (data.success) {
          setOrders(data.orders || []);
          console.log(`✅ Админ: Загружено ${data.orders?.length || 0} заказов`);
        } else {
          console.error('❌ Админ: Ошибка в ответе API:', data.error);
          alert('Ошибка загрузки заказов: ' + (data.error || 'Неизвестная ошибка'));
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Админ: Ошибка HTTP:', response.status, errorData);
        alert('Ошибка загрузки заказов: ' + (errorData.error || 'HTTP ' + response.status));
      }
    } catch (error) {
      console.error('❌ Админ: Ошибка сети:', error);
      alert('Ошибка сети при загрузке заказов: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const credentials = btoa(`${username}:${password}`);
      const response = await fetch('/api/admin/emails', {
        headers: {
          'Authorization': `Basic ${credentials}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setEmails(data.emails || []);
      } else {
        console.error('Ошибка загрузки писем');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch('/api/admin/update-order-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (response.ok) {
        fetchOrders(); // Обновляем список заказов
      } else {
        alert('Ошибка обновления статуса');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка обновления статуса');
    }
  };

  const deleteOrder = async (orderId) => {
    if (!confirm('Вы уверены, что хотите удалить этот заказ?')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/delete-order', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ orderId }),
      });

      if (response.ok) {
        fetchOrders(); // Обновляем список заказов
      } else {
        alert('Ошибка удаления заказа');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка удаления заказа');
    }
  };

  const sendOrderEmail = async (orderId) => {
    setEmailStatus('Отправка...');
    try {
      const response = await fetch('/api/admin/send-email', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });

      if (response.ok) {
        setEmailStatus('Email отправлен успешно!');
        setTimeout(() => setEmailStatus(''), 3000);
      } else {
        setEmailStatus('Ошибка отправки email');
        setTimeout(() => setEmailStatus(''), 3000);
      }
    } catch (error) {
      setEmailStatus('Ошибка отправки email');
      setTimeout(() => setEmailStatus(''), 3000);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ru-RU');
  };

  const getOrderStatus = (status) => {
    const statusMap = {
      'pending': 'Ожидает обработки',
      'confirmed': 'Подтвержден',
      'processing': 'В обработке',
      'shipped': 'Отправлен',
      'delivered': 'Доставлен',
      'cancelled': 'Отменен'
    };
    return statusMap[status] || status;
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      'pending': 'fas fa-clock',
      'confirmed': 'fas fa-check-circle',
      'processing': 'fas fa-cogs',
      'shipped': 'fas fa-shipping-fast',
      'delivered': 'fas fa-box-check',
      'cancelled': 'fas fa-times-circle'
    };
    return iconMap[status] || 'fas fa-question-circle';
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'pending': '#ffa500',
      'confirmed': '#007bff',
      'processing': '#17a2b8',
      'shipped': '#28a745',
      'delivered': '#6c757d',
      'cancelled': '#dc3545'
    };
    return colorMap[status] || '#6c757d';
  };

  // Страница входа
  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-form">
          <h1>Вход в админ панель</h1>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Имя пользователя:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Пароль:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-login" disabled={loading}>
              <i className="fas fa-sign-in-alt"></i> {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
          <button onClick={() => router.push('/')} className="btn-back">
            <i className="fas fa-arrow-left"></i> На главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Боковое меню */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>BioMorphX</h2>
          <p>Админ панель</p>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <i className="fas fa-shopping-cart"></i>
            Заказы ({orders.length})
          </button>
          <button 
            className={`nav-item ${activeTab === 'emails' ? 'active' : ''}`}
            onClick={() => setActiveTab('emails')}
          >
            <i className="fas fa-envelope"></i>
            Письма
          </button>
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <i className="fas fa-chart-bar"></i>
            Статистика
          </button>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <i className="fas fa-cog"></i>
            Настройки
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn-logout">
            <i className="fas fa-sign-out-alt"></i> Выйти
          </button>
        </div>
      </div>

      {/* Основной контент */}
      <div className="admin-main">
        <div className="admin-header">
          <h1>
            {activeTab === 'orders' && 'Управление заказами'}
            {activeTab === 'emails' && 'Письма с сайта'}
            {activeTab === 'dashboard' && 'Статистика'}
            {activeTab === 'settings' && 'Настройки'}
          </h1>
          <button onClick={() => router.push('/')} className="btn-back">
            <i className="fas fa-arrow-left"></i> На главную
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'orders' && (
            <div className="orders-section">
              {emailStatus && (
                <div className={`email-status ${emailStatus.includes('успешно') ? 'success' : 'error'}`}>
                  {emailStatus}
                </div>
              )}

              <div className="orders-list">
                {loading ? (
                  <div className="loading">Загрузка заказов...</div>
                ) : orders.length === 0 ? (
                  <div className="no-orders">
                    <i className="fas fa-shopping-cart"></i>
                    <p>Заказов пока нет</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div className="order-info">
                          <h3>Заказ #{order.id}</h3>
                          <span 
                            className="order-status"
                            style={{ backgroundColor: getStatusColor(order.status) }}
                          >
                            <i className={getStatusIcon(order.status)}></i>
                            {getOrderStatus(order.status)}
                          </span>
                        </div>
                        <div className="order-date">
                          {formatDate(order.created_at)}
                        </div>
                      </div>

                      <div className="order-details">
                        <div className="customer-info">
                          <h4>Клиент:</h4>
                          <p><strong>Email:</strong> {order.customer_email}</p>
                          <p><strong>Имя:</strong> {order.customer_name}</p>
                          <p>
                            <strong>Телефон:</strong> {order.customer_phone}
                            {order.customer_phone && (
                              <a 
                                href={`https://wa.me/${order.customer_phone.replace(/\D/g, '')}?text=Добрый день, пишите - проконсультирую. Заказ #${order.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="whatsapp-link"
                                title="Написать в WhatsApp"
                              >
                                <i className="fab fa-whatsapp"></i>
                              </a>
                            )}
                          </p>
                          <p><strong>Адрес:</strong> {order.shipping_address}</p>
                        </div>

                        <div className="order-items">
                          <h4>Товары:</h4>
                          {order.items?.map((item, index) => (
                            <div key={index} className="order-item">
                              <span>{item.title}</span>
                              <span>{item.quantity} шт.</span>
                              <span>{item.unit_price} ₽</span>
                            </div>
                          ))}
                        </div>

                        <div className="order-total">
                          <h4>Итого: {order.total_price} ₽</h4>
                        </div>
                      </div>

                      <div className="order-actions">
                        <select 
                          value={order.status} 
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="status-select"
                        >
                          <option value="pending">Ожидает обработки</option>
                          <option value="confirmed">Подтвержден</option>
                          <option value="processing">В обработке</option>
                          <option value="shipped">Отправлен</option>
                          <option value="delivered">Доставлен</option>
                          <option value="cancelled">Отменен</option>
                        </select>
                        
                        <button 
                          onClick={() => sendOrderEmail(order.id)}
                          className={`btn-send-email ${order.email_sent ? 'sent' : ''}`}
                          disabled={order.email_sent}
                        >
                          <i className="fas fa-envelope"></i> 
                          {order.email_sent ? 'Отправлен' : 'Email'}
                        </button>
                        
                        <button 
                          onClick={() => deleteOrder(order.id)}
                          className="btn-delete"
                        >
                          <i className="fas fa-trash"></i> Удалить
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'emails' && (
            <div className="emails-section">
              <div className="emails-list">
                {loading ? (
                  <div className="loading">Загрузка писем...</div>
                ) : emails.length === 0 ? (
                  <div className="no-emails">
                    <i className="fas fa-envelope"></i>
                    <p>Писем пока нет</p>
                  </div>
                ) : (
                  emails.map((email) => (
                    <div key={email.id} className="email-card">
                      <div className="email-header">
                        <div className="email-info">
                          <h3>Письмо от {email.name}</h3>
                          <span className="email-date">{formatDate(email.created_at)}</span>
                        </div>
                      </div>

                      <div className="email-details">
                        <div className="email-contact">
                          <p><strong>Email:</strong> {email.email}</p>
                          <p><strong>Телефон:</strong> {email.phone}</p>
                        </div>

                        <div className="email-message">
                          <h4>Сообщение:</h4>
                          <p>{email.message}</p>
                        </div>
                      </div>

                      <div className="email-actions">
                        <a 
                          href={`mailto:${email.email}?subject=Ответ на ваше сообщение`}
                          className="btn-reply"
                        >
                          <i className="fas fa-reply"></i> Ответить
                        </a>
                        
                        {email.phone && (
                          <a 
                                                            href={`https://wa.me/79990413755?text=Добрый день, пишите - проконсультирую. Письмо от ${email.name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="whatsapp-link"
                            title="Написать в WhatsApp"
                          >
                            <i className="fab fa-whatsapp"></i> WhatsApp
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="dashboard-section">
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Всего заказов</h3>
                  <p>{orders.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Ожидают обработки</h3>
                  <p>{orders.filter(o => o.status === 'pending').length}</p>
                </div>
                <div className="stat-card">
                  <h3>Подтверждены</h3>
                  <p>{orders.filter(o => o.status === 'confirmed').length}</p>
                </div>
                <div className="stat-card">
                  <h3>Доставлены</h3>
                  <p>{orders.filter(o => o.status === 'delivered').length}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-section">
              <h2>Настройки админ панели</h2>
              <p>Здесь можно настроить параметры админ панели.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
