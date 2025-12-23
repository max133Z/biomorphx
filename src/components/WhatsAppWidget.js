"use client";

import { useState, useEffect } from 'react';

export default function WhatsAppWidget() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  useEffect(() => {
    // Показываем виджет только один раз на главной странице
    const isHomePage = window.location.pathname === '/';
    const hasShownBefore = localStorage.getItem('whatsappWidgetShown');
    
    if (isHomePage && !hasShownBefore) {
      // Показываем через 3 секунды после загрузки страницы
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsWidgetOpen(true);
        setHasShown(true);
        localStorage.setItem('whatsappWidgetShown', 'true');
      }, 3000);

      return () => clearTimeout(timer);
    } else if (isHomePage) {
      // Если виджет уже показывался, просто делаем его видимым
      setIsVisible(true);
    }
  }, []);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Добрый день, пишите - проконсультирую');
    window.open(`https://wa.me/79046389416?text=${message}`, '_blank');
  };

  const handleClose = () => {
    setIsWidgetOpen(false);
  };

  const handleIconClick = () => {
    setIsWidgetOpen(true);
  };

  const handleTelegramClick = () => {
    window.open('https://t.me/biomorphx', '_blank');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Десктопная версия */}
      <div className="whatsapp-widget-icon-desktop">
        <div className="social-widgets-group">
          <button onClick={handleTelegramClick} className="telegram-widget-icon-button" title="Telegram канал">
            <i className="fab fa-telegram"></i>
          </button>
          {isWidgetOpen ? (
            <div className="whatsapp-widget-desktop">
              <div className="whatsapp-widget-content">
                <div className="whatsapp-widget-header">
                  <div className="whatsapp-widget-avatar">
                    <i className="fab fa-whatsapp"></i>
                  </div>
                  <div className="whatsapp-widget-info">
                    <h4>BioMorphX</h4>
                    <p>Онлайн консультация</p>
                  </div>
                  <button onClick={handleClose} className="whatsapp-widget-close">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="whatsapp-widget-message">
                  <p>Добрый день, пишите - проконсультирую</p>
                </div>
                <button onClick={handleWhatsAppClick} className="whatsapp-widget-button">
                  <i className="fab fa-whatsapp"></i>
                  Написать в WhatsApp
                </button>
              </div>
            </div>
          ) : (
            <button onClick={handleIconClick} className="whatsapp-widget-icon-button" title="WhatsApp">
              <i className="fab fa-whatsapp"></i>
            </button>
          )}
        </div>
      </div>

      {/* Мобильная версия - только иконки */}
      <div className="whatsapp-widget-mobile">
        <div className="social-widgets-group-mobile">
          <button onClick={handleTelegramClick} className="telegram-widget-mobile-button" title="Telegram канал">
            <i className="fab fa-telegram"></i>
          </button>
          <button onClick={handleWhatsAppClick} className="whatsapp-widget-mobile-button" title="WhatsApp">
            <i className="fab fa-whatsapp"></i>
          </button>
        </div>
      </div>

      <style jsx>{`
        .whatsapp-widget-desktop {
          position: relative;
          animation: slideIn 0.3s ease-out;
          margin-top: 12px;
        }

        .whatsapp-widget-content {
          background: rgba(26, 31, 74, 0.95);
          border: 1px solid rgba(147, 112, 219, 0.3);
          border-radius: 16px;
          padding: 20px;
          width: 280px;
          backdrop-filter: blur(10px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .whatsapp-widget-header {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }

        .whatsapp-widget-avatar {
          width: 40px;
          height: 40px;
          background: #25d366;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          font-size: 20px;
          color: white;
        }

        .whatsapp-widget-info h4 {
          margin: 0;
          color: var(--text);
          font-size: 14px;
          font-weight: 600;
        }

        .whatsapp-widget-info p {
          margin: 0;
          color: rgba(255, 255, 255, 0.7);
          font-size: 12px;
        }

        .whatsapp-widget-close {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          margin-left: auto;
          padding: 5px;
          font-size: 14px;
          transition: color 0.3s ease;
        }

        .whatsapp-widget-close:hover {
          color: var(--text);
        }

        .whatsapp-widget-message {
          background: rgba(37, 211, 102, 0.1);
          border: 1px solid rgba(37, 211, 102, 0.2);
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 15px;
        }

        .whatsapp-widget-message p {
          margin: 0;
          color: var(--text);
          font-size: 13px;
          line-height: 1.4;
        }

        .whatsapp-widget-button {
          width: 100%;
          background: #25d366;
          color: white;
          border: none;
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .whatsapp-widget-button:hover {
          background: #128c7e;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(37, 211, 102, 0.3);
        }

        .whatsapp-widget-mobile {
          display: none;
        }

        .social-widgets-group-mobile {
          position: fixed;
          bottom: 20px;
          right: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 1000;
        }

        .whatsapp-widget-mobile-button {
          width: 50px;
          height: 50px;
          background: #25d366;
          color: white;
          border: none;
          border-radius: 50%;
          font-size: 20px;
          cursor: pointer;
          box-shadow: 0 5px 15px rgba(37, 211, 102, 0.3);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .whatsapp-widget-mobile-button:hover {
          background: #128c7e;
          transform: scale(1.1);
          box-shadow: 0 8px 20px rgba(37, 211, 102, 0.4);
        }

        .telegram-widget-mobile-button {
          width: 50px;
          height: 50px;
          background: #0088cc;
          color: white;
          border: none;
          border-radius: 50%;
          font-size: 20px;
          cursor: pointer;
          box-shadow: 0 5px 15px rgba(0, 136, 204, 0.3);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .telegram-widget-mobile-button:hover {
          background: #006ba3;
          transform: scale(1.1);
          box-shadow: 0 8px 20px rgba(0, 136, 204, 0.4);
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .whatsapp-widget-icon-desktop {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
        }

        .social-widgets-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: flex-end;
        }

        .whatsapp-widget-icon-button {
          width: 60px;
          height: 60px;
          background: #25d366;
          color: white;
          border: none;
          border-radius: 50%;
          font-size: 24px;
          cursor: pointer;
          box-shadow: 0 5px 15px rgba(37, 211, 102, 0.3);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .whatsapp-widget-icon-button:hover {
          background: #128c7e;
          transform: scale(1.1);
          box-shadow: 0 8px 20px rgba(37, 211, 102, 0.4);
        }

        .telegram-widget-icon-button {
          width: 60px;
          height: 60px;
          background: #0088cc;
          color: white;
          border: none;
          border-radius: 50%;
          font-size: 24px;
          cursor: pointer;
          box-shadow: 0 5px 15px rgba(0, 136, 204, 0.3);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .telegram-widget-icon-button:hover {
          background: #006ba3;
          transform: scale(1.1);
          box-shadow: 0 8px 20px rgba(0, 136, 204, 0.4);
        }

        @media (max-width: 768px) {
          .whatsapp-widget-desktop,
          .whatsapp-widget-icon-desktop {
            display: none;
          }
          
          .whatsapp-widget-mobile {
            display: block;
          }
        }
      `}</style>
    </>
  );
}
