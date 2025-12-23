"use client";

import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Ошибка отправки:', error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Header />

      <section className="page-hero">
        <div className="container">
          <div className="page-hero-content">
            <h1>Контакты</h1>
            <p>Свяжитесь с нами любым удобным способом</p>
          </div>
        </div>
      </section>

      <section className="about-section" style={{padding: '80px 0'}}>
        <div className="container">
          <div className="section-title">
            <h2>Как с нами связаться?</h2>
            <p>Мы всегда рады ответить на ваши вопросы и помочь с выбором продукции</p>
          </div>

          <div className="contact-container" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '50px'}}>
            <div className="contact-card" style={{background: 'rgba(20, 30, 50, 0.6)', borderRadius: '20px', padding: '30px', transition: 'var(--transition)', border: '1px solid rgba(76, 181, 174, 0.2)'}}>
              <h3 style={{fontSize: '22px', marginBottom: '20px', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '15px'}}>
                <i className="fas fa-map-marker-alt"></i> Адрес
              </h3>
              <p style={{color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.8', fontSize: '16px'}}>
                Санкт-Петербург,<br/>
                проспект Александровской фермы 2,<br/>
                строение 2, помещение 9
              </p>
            </div>

            <div className="contact-card" style={{background: 'rgba(20, 30, 50, 0.6)', borderRadius: '20px', padding: '30px', transition: 'var(--transition)', border: '1px solid rgba(76, 181, 174, 0.2)'}}>
              <h3 style={{fontSize: '22px', marginBottom: '20px', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '15px'}}>
                <i className="fas fa-phone"></i> Телефон
              </h3>
              <p style={{color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.8', fontSize: '16px'}}>
                +7 904 638 94 16<br/>
                <span style={{color: 'var(--gray)', fontSize: '14px'}}>Поддержка 24/7</span>
              </p>
            </div>

            <div className="contact-card" style={{background: 'rgba(20, 30, 50, 0.6)', borderRadius: '20px', padding: '30px', transition: 'var(--transition)', border: '1px solid rgba(76, 181, 174, 0.2)'}}>
              <h3 style={{fontSize: '22px', marginBottom: '20px', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '15px'}}>
                <i className="fas fa-paper-plane"></i> Мессенджеры
              </h3>
              <p style={{color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.8', fontSize: '16px'}}>
                Telegram: @craftlabworker<br/>
                WhatsApp: +7 904 638 94 16
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="contact-form" style={{maxWidth: '800px', margin: '80px auto 0', background: 'rgba(20, 30, 50, 0.6)', borderRadius: '20px', padding: '40px', border: '1px solid rgba(76, 181, 174, 0.2)'}}>
            <h3 style={{fontSize: '28px', marginBottom: '30px', textAlign: 'center', color: 'var(--accent)'}}>Напишите нам</h3>
            
            {status === 'success' && (
              <div style={{background: 'rgba(40, 167, 69, 0.2)', color: '#28a745', padding: '15px', borderRadius: '10px', marginBottom: '20px', border: '1px solid rgba(40, 167, 69, 0.3)'}}>
                Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.
              </div>
            )}
            
            {status === 'error' && (
              <div style={{background: 'rgba(220, 53, 69, 0.2)', color: '#dc3545', padding: '15px', borderRadius: '10px', marginBottom: '20px', border: '1px solid rgba(220, 53, 69, 0.3)'}}>
                Произошла ошибка при отправке сообщения. Попробуйте позже.
              </div>
            )}
            
            <div className="form-group" style={{marginBottom: '25px'}}>
              <label htmlFor="name" style={{display: 'block', marginBottom: '10px', fontWeight: 600, color: 'var(--text)'}}>Ваше имя *</label>
              <input 
                type="text" 
                id="name" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{width: '100%', padding: '15px', background: 'rgba(255, 255, 255, 0.07)', border: '2px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: 'var(--text)', fontSize: '16px', transition: 'var(--transition)'}} 
                placeholder="Введите ваше имя"
              />
            </div>
            
            <div className="form-group" style={{marginBottom: '25px'}}>
              <label htmlFor="email" style={{display: 'block', marginBottom: '10px', fontWeight: 600, color: 'var(--text)'}}>Ваш email *</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{width: '100%', padding: '15px', background: 'rgba(255, 255, 255, 0.07)', border: '2px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: 'var(--text)', fontSize: '16px', transition: 'var(--transition)'}} 
                placeholder="Введите ваш email"
              />
            </div>
            
            <div className="form-group" style={{marginBottom: '25px'}}>
              <label htmlFor="phone" style={{display: 'block', marginBottom: '10px', fontWeight: 600, color: 'var(--text)'}}>Ваш телефон</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={{width: '100%', padding: '15px', background: 'rgba(255, 255, 255, 0.07)', border: '2px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: 'var(--text)', fontSize: '16px', transition: 'var(--transition)'}} 
                placeholder="Введите ваш телефон"
              />
            </div>
            
            <div className="form-group" style={{marginBottom: '30px'}}>
              <label htmlFor="message" style={{display: 'block', marginBottom: '10px', fontWeight: 600, color: 'var(--text)'}}>Ваше сообщение *</label>
              <textarea 
                id="message" 
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                style={{width: '100%', height: '150px', padding: '15px', background: 'rgba(255, 255, 255, 0.07)', border: '2px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: 'var(--text)', fontSize: '16px', transition: 'var(--transition)', resize: 'none'}} 
                placeholder="Ваше сообщение"
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="btn" 
              style={{width: '100%'}}
              disabled={loading}
            >
              {loading ? 'Отправка...' : 'Отправить сообщение'}
            </button>
          </form>

          <div style={{marginTop: '80px', background: 'rgba(20, 30, 50, 0.6)', borderRadius: '20px', padding: '30px', border: '1px solid rgba(76, 181, 174, 0.2)'}}>
            <h3 style={{fontSize: '22px', marginBottom: '20px', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '15px'}}>
              <i className="fas fa-info-circle"></i> Реквизиты
            </h3>
            <p style={{color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.8', fontSize: '16px', marginBottom: '15px'}}>
              ИП Скаромный Владислав Андреевич<br/>
              ИНН 251009076204<br/>
              Email: biomorphx@proton.me
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

