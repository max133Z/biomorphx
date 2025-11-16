"use client";

import { useState } from "react";

const TopHeader = () => {
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [callbackData, setCallbackData] = useState({
    name: '',
    phone: '+7'
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleCallbackSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      const response = await fetch('/api/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(callbackData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setCallbackData({ name: '', phone: '+7' });
        setTimeout(() => {
          setIsCallbackOpen(false);
          setStatus('');
        }, 2000);
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

  const handleCallbackChange = (e) => {
    setCallbackData({
      ...callbackData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <div className="top-header">
        <div className="container">
          <div className="top-header-content">
            <div className="top-header-left">
              <span className="location">
                <i className="fas fa-map-marker-alt"></i>
                Санкт-Петербург
              </span>
              <a href="tel:+79046389416" className="phone">
                <i className="fas fa-phone"></i>
                +7 904 638 94 16
              </a>
            </div>
            <div className="top-header-right">
              <button 
                className="callback-btn"
                onClick={() => setIsCallbackOpen(true)}
              >
                <i className="fas fa-phone"></i>
                Заказать звонок
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно заказа звонка */}
      {isCallbackOpen && (
        <div className="callback-modal-overlay" onClick={() => setIsCallbackOpen(false)}>
          <div className="callback-modal" onClick={(e) => e.stopPropagation()}>
            <div className="callback-modal-header">
              <h3>Заказать звонок</h3>
              <button 
                className="callback-modal-close"
                onClick={() => setIsCallbackOpen(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleCallbackSubmit} className="callback-form">
              {status === 'success' && (
                <div className="callback-success">
                  Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.
                </div>
              )}
              
              {status === 'error' && (
                <div className="callback-error">
                  Произошла ошибка при отправке заявки. Попробуйте позже.
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="callback-name">Ваше имя *</label>
                <input 
                  type="text" 
                  id="callback-name" 
                  name="name"
                  value={callbackData.name}
                  onChange={handleCallbackChange}
                  required
                  placeholder="Введите ваше имя"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="callback-phone">Ваш телефон *</label>
                <input 
                  type="tel" 
                  id="callback-phone" 
                  name="phone"
                  value={callbackData.phone}
                  onChange={(e) => {
                    let value = e.target.value;
                    
                    // Если пытаются стереть +7, оставляем +7
                    if (value.length < 2 || !value.startsWith('+7')) {
                      value = '+7';
                    } else {
                      // Убираем все кроме цифр и + для обработки
                      let digits = value.replace(/[^\d+]/g, '');
                      
                      // Если начинается с +7, убираем +7 и обрабатываем только цифры
                      if (digits.startsWith('+7')) {
                        digits = digits.substring(2);
                      } else if (digits.startsWith('7')) {
                        digits = digits.substring(1);
                      }
                      
                      // Ограничиваем до 10 цифр
                      if (digits.length > 10) {
                        digits = digits.substring(0, 10);
                      }
                      
                      // Форматируем только если есть цифры
                      if (digits.length === 0) {
                        value = '+7';
                      } else if (digits.length <= 3) {
                        value = `+7 (${digits}`;
                      } else if (digits.length <= 6) {
                        value = `+7 (${digits.substring(0, 3)}) ${digits.substring(3)}`;
                      } else if (digits.length <= 8) {
                        value = `+7 (${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6)}`;
                      } else {
                        value = `+7 (${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6, 8)}-${digits.substring(8)}`;
                      }
                    }
                    
                    setCallbackData({
                      ...callbackData,
                      phone: value
                    });
                  }}
                  required
                  placeholder="+7 (999) 123-45-67"
                  maxLength={18}
                />
              </div>
              
              <button 
                type="submit" 
                className="callback-submit-btn"
                disabled={loading}
              >
                {loading ? 'Отправка...' : 'Заказать звонок'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .top-header {
          background: rgba(20, 30, 50, 0.95);
          border-bottom: 1px solid rgba(76, 181, 174, 0.2);
          padding: 4px 0;
          font-size: 12px;
          backdrop-filter: blur(10px);
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
        }

        .top-header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .top-header-left {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .top-header-left span,
        .top-header-left a {
          color: rgba(255, 255, 255, 0.8);
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        
        .top-header-left a:hover {
          color: var(--accent);
        }

        .top-header-left i {
          color: var(--accent);
          font-size: 10px;
        }

        .callback-btn {
          background: var(--accent);
          color: white;
          border: none;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .callback-btn i {
          font-size: 10px;
        }

        .callback-btn:hover {
          background: #4a9b94;
          transform: translateY(-1px);
        }

        .callback-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          backdrop-filter: blur(5px);
        }

        .callback-modal {
          background: rgba(20, 30, 50, 0.95);
          border: 1px solid rgba(76, 181, 174, 0.3);
          border-radius: 20px;
          padding: 30px;
          width: 90%;
          max-width: 400px;
          backdrop-filter: blur(10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .callback-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .callback-modal-header h3 {
          color: var(--accent);
          margin: 0;
          font-size: 20px;
        }

        .callback-modal-close {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          font-size: 18px;
          padding: 5px;
          transition: color 0.3s ease;
        }

        .callback-modal-close:hover {
          color: var(--text);
        }

        .callback-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          color: var(--text);
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .form-group input {
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.07);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: var(--text);
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--accent);
          background: rgba(255, 255, 255, 0.1);
        }

        .callback-submit-btn {
          background: var(--accent);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
        }

        .callback-submit-btn:hover:not(:disabled) {
          background: #4a9b94;
          transform: translateY(-2px);
        }

        .callback-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .callback-success {
          background: rgba(40, 167, 69, 0.2);
          color: #28a745;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid rgba(40, 167, 69, 0.3);
          font-size: 14px;
          text-align: center;
        }

        .callback-error {
          background: rgba(220, 53, 69, 0.2);
          color: #dc3545;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid rgba(220, 53, 69, 0.3);
          font-size: 14px;
          text-align: center;
        }

        @media (max-width: 768px) {
          .callback-modal {
            padding: 20px;
            margin: 20px;
          }
        }
      `}</style>
    </>
  );
};

export default TopHeader;
