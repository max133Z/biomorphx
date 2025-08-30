"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../styles/admin/admin-panel.css';

export default function AdminPanel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [emailStatus, setEmailStatus] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        console.error('Ошибка загрузки заказов');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendOrderEmail = async (orderId) => {
    setEmailStatus('Отправка...');
    try {
      const response = await fetch('/api/admin/send-email', {
        method: 'POST',
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

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Загрузка заказов...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Панель администратора</h1>
        <button onClick={() => router.push('/')} className="btn-back">
          <i className="fas fa-arrow-left"></i> На главную
        </button>
      </div>

      <div className="admin-content">
        <div className="orders-section">
          <h2>Заказы ({orders.length})</h2>
          
          {emailStatus && (
            <div className={`email-status ${emailStatus.includes('успешно') ? 'success' : 'error'}`}>
              {emailStatus}
            </div>
          )}

          <div className="orders-list">
            {orders.length === 0 ? (
              <div className="no-orders">
                <i className="fas fa-shopping-cart"></i>
                <p>Заказов пока нет</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3>Заказ #{order.display_id}</h3>
                      <span className={`order-status ${order.status}`}>
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
                      <p><strong>Имя:</strong> {order.shipping_address?.first_name} {order.shipping_address?.last_name}</p>
                      <p><strong>Email:</strong> {order.email}</p>
                      <p><strong>Телефон:</strong> {order.shipping_address?.phone}</p>
                      <p><strong>Адрес:</strong> {order.shipping_address?.address_1}</p>
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
                      <h4>Итого: {order.total} ₽</h4>
                    </div>
                  </div>

                  <div className="order-actions">
                    <button 
                      onClick={() => sendOrderEmail(order.id)}
                      className="btn-send-email"
                    >
                      <i className="fas fa-envelope"></i> Отправить email
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
