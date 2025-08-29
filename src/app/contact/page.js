"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Contact() {
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
                +7 (999) 041-37-55<br/>
                <span style={{color: 'var(--gray)', fontSize: '14px'}}>Поддержка 24/7</span>
              </p>
            </div>

            <div className="contact-card" style={{background: 'rgba(20, 30, 50, 0.6)', borderRadius: '20px', padding: '30px', transition: 'var(--transition)', border: '1px solid rgba(76, 181, 174, 0.2)'}}>
              <h3 style={{fontSize: '22px', marginBottom: '20px', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '15px'}}>
                <i className="fas fa-paper-plane"></i> Мессенджеры
              </h3>
              <p style={{color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.8', fontSize: '16px'}}>
                Telegram: @biomorphx_support<br/>
                WhatsApp: +7 (999) 041-37-55
              </p>
            </div>
          </div>

          <div className="contact-form" style={{maxWidth: '800px', margin: '80px auto 0', background: 'rgba(20, 30, 50, 0.6)', borderRadius: '20px', padding: '40px', border: '1px solid rgba(76, 181, 174, 0.2)'}}>
            <h3 style={{fontSize: '28px', marginBottom: '30px', textAlign: 'center', color: 'var(--accent)'}}>Напишите нам</h3>
            
            <div className="form-group" style={{marginBottom: '25px'}}>
              <label htmlFor="name" style={{display: 'block', marginBottom: '10px', fontWeight: 600, color: 'var(--text)'}}>Ваше имя</label>
              <input type="text" id="name" style={{width: '100%', padding: '15px', background: 'rgba(255, 255, 255, 0.07)', border: '2px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: 'var(--text)', fontSize: '16px', transition: 'var(--transition)'}} placeholder="Введите ваше имя"/>
            </div>
            
            <div className="form-group" style={{marginBottom: '25px'}}>
              <label htmlFor="email" style={{display: 'block', marginBottom: '10px', fontWeight: 600, color: 'var(--text)'}}>Ваш email</label>
              <input type="email" id="email" style={{width: '100%', padding: '15px', background: 'rgba(255, 255, 255, 0.07)', border: '2px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: 'var(--text)', fontSize: '16px', transition: 'var(--transition)'}} placeholder="Введите ваш email"/>
            </div>
            
            <div className="form-group" style={{marginBottom: '25px'}}>
              <label htmlFor="subject" style={{display: 'block', marginBottom: '10px', fontWeight: 600, color: 'var(--text)'}}>Тема сообщения</label>
              <input type="text" id="subject" style={{width: '100%', padding: '15px', background: 'rgba(255, 255, 255, 0.07)', border: '2px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: 'var(--text)', fontSize: '16px', transition: 'var(--transition)'}} placeholder="Тема сообщения"/>
            </div>
            
            <div className="form-group" style={{marginBottom: '30px'}}>
              <label htmlFor="message" style={{display: 'block', marginBottom: '10px', fontWeight: 600, color: 'var(--text)'}}>Ваше сообщение</label>
              <textarea id="message" style={{width: '100%', height: '150px', padding: '15px', background: 'rgba(255, 255, 255, 0.07)', border: '2px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: 'var(--text)', fontSize: '16px', transition: 'var(--transition)', resize: 'none'}} placeholder="Ваше сообщение"></textarea>
            </div>
            
            <button className="btn" style={{width: '100%'}}>Отправить сообщение</button>
          </div>

          <div style={{marginTop: '80px', background: 'rgba(20, 30, 50, 0.6)', borderRadius: '20px', padding: '30px', border: '1px solid rgba(76, 181, 174, 0.2)'}}>
            <h3 style={{fontSize: '22px', marginBottom: '20px', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '15px'}}>
              <i className="fas fa-info-circle"></i> Реквизиты
            </h3>
            <p style={{color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.8', fontSize: '16px', marginBottom: '15px'}}>
              ИП Скаромный Владислав Андреевич<br/>
              ИНН 251009076204
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
