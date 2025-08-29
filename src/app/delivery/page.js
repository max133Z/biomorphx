"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Delivery() {
  return (
    <>
      <Header />

      <section className="delivery-page-hero">
        <div className="container">
          <div className="page-hero-content">
            <h1>Доставка и оплата</h1>
            <p>Удобные способы получения и оплаты ваших заказов</p>
          </div>
        </div>
      </section>

      <section className="about-section" style={{padding: '80px 0'}}>
        <div className="container">
          <div className="section-title">
            <h2>Способы доставки</h2>
            <p>Мы находимся в Санкт-Петербурге и предлагаем несколько вариантов доставки</p>
          </div>

          <div className="delivery-methods" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '50px'}}>
            <div className="delivery-card" style={{background: 'rgba(20, 30, 50, 0.6)', borderRadius: '20px', padding: '30px', transition: 'var(--transition)', border: '1px solid rgba(76, 181, 174, 0.2)'}}>
              <h3 style={{fontSize: '22px', marginBottom: '20px', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '15px'}}>
                <i className="fas fa-truck"></i> Экспресс доставка по СПб
              </h3>
              <p style={{color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.8', fontSize: '16px', marginBottom: '15px'}}>
                Бесплатная доставка курьером в пределах Санкт-Петербурга.
              </p>
              <p style={{color: 'var(--gray)', fontSize: '14px'}}>
                Срок доставки: 2-4 ч. 
              </p>
            </div>

            <div className="delivery-card" style={{background: 'rgba(20, 30, 50, 0.6)', borderRadius: '20px', padding: '30px', transition: 'var(--transition)', border: '1px solid rgba(76, 181, 174, 0.2)'}}>
              <h3 style={{fontSize: '22px', marginBottom: '20px', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '15px'}}>
                <i className="fas fa-box"></i> СДЭК
              </h3>
              <p style={{color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.8', fontSize: '16px', marginBottom: '15px'}}>
                Доставка в любой город России через службу СДЭК. Стоимость рассчитывается при оформлении заказа.
              </p>
              <p style={{color: 'var(--gray)', fontSize: '14px'}}>
                Срок доставки: 1-5 дней
              </p>
            </div>

            <div className="delivery-card" style={{background: 'rgba(20, 30, 50, 0.6)', borderRadius: '20px', padding: '30px', transition: 'var(--transition)', border: '1px solid rgba(76, 181, 174, 0.2)'}}>
              <h3 style={{fontSize: '22px', marginBottom: '20px', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '15px'}}>
                <i className="fas fa-envelope"></i> Почта России
              </h3>
              <p style={{color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.8', fontSize: '16px', marginBottom: '15px'}}>
                Доставка через Почту России. Стоимость рассчитывается при оформлении заказа.
              </p>
              <p style={{color: 'var(--gray)', fontSize: '14px'}}>
                Срок доставки: 5-14 дней
              </p>
            </div>
          </div>

          <div className="payment-methods" style={{marginTop: '80px', marginBottom: '40px'}}>
            <div className="section-title">
              <h2>Способы оплаты</h2>
              <p>Выберите удобный для вас способ оплаты</p>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', marginTop: '40px'}}>
              <div style={{background: 'rgba(20, 30, 50, 0.6)', borderRadius: '15px', padding: '20px', textAlign: 'center', border: '1px solid rgba(76, 181, 174, 0.2)'}}>
                <i className="fas fa-credit-card" style={{fontSize: '36px', color: 'var(--accent)', marginBottom: '15px'}}></i>
                <h4 style={{fontSize: '18px', marginBottom: '10px', color: 'var(--text)'}}>Банковской картой</h4>
                <p style={{color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px'}}>Онлайн при оформлении заказа</p>
              </div>

              <div style={{background: 'rgba(20, 30, 50, 0.6)', borderRadius: '15px', padding: '20px', textAlign: 'center', border: '1px solid rgba(76, 181, 174, 0.2)'}}>
                <i className="fas fa-mobile-alt" style={{fontSize: '36px', color: 'var(--accent)', marginBottom: '15px'}}></i>
                <h4 style={{fontSize: '18px', marginBottom: '10px', color: 'var(--text)'}}>СБП</h4>
                <p style={{color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px'}}>Оплата через СБП</p>
              </div>

              <div style={{background: 'rgba(20, 30, 50, 0.6)', borderRadius: '15px', padding: '20px', textAlign: 'center', border: '1px solid rgba(76, 181, 174, 0.2)'}}>
                <i className="fas fa-money-bill-wave" style={{fontSize: '36px', color: 'var(--accent)', marginBottom: '15px'}}></i>
                <h4 style={{fontSize: '18px', marginBottom: '10px', color: 'var(--text)'}}>Наличными</h4>
                <p style={{color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px'}}>При получении заказа</p>
              </div>
            </div>
          </div>

          <div style={{marginTop: '80px', background: 'rgba(20, 30, 50, 0.6)', borderRadius: '20px', padding: '30px', border: '1px solid rgba(76, 181, 174, 0.2)'}}>
            <h3 style={{fontSize: '22px', marginBottom: '20px', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '15px'}}>
              <i className="fas fa-headset"></i> Поддержка
            </h3>
            <p style={{color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.8', fontSize: '16px', marginBottom: '15px'}}>
              Наша служба поддержки работает 24/7. Если у вас есть вопросы по доставке или оплате, свяжитесь с нами любым удобным способом.
            </p>
            <p style={{color: 'var(--accent)', fontWeight: 600}}>
              Телефон: +7 (999) 041-37-55<br/>
              Email: support@biomorphx.ru<br/>
              Telegram: @biomorphx_support
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
