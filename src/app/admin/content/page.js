"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [content, setContent] = useState({
    home: {
      heroTitle: "Научные решения для вашего здоровья",
      heroSubtitle: "Инновационные биологически активные добавки, разработанные на основе последних научных исследований для поддержания оптимального здоровья.",
      scienceTitle: "Научная основа",
      scienceSubtitle: "Наши продукты созданы на основе передовых исследований в области биохимии и нутрициологии",
      scienceCards: [
        {
          icon: "fas fa-microscope",
          title: "Молекулярная точность",
          description: "Мы используем только те формы нутриентов, которые имеют наилучшую биодоступность и доказанную эффективность в клинических исследованиях."
        },
        {
          icon: "fas fa-sync-alt",
          title: "Синергия компонентов",
          description: "Наши формулы разработаны с учетом синергетического взаимодействия компонентов для максимального эффекта."
        },
        {
          icon: "fas fa-book",
          title: "Доказательная база",
          description: "Каждый ингредиент в составе наших продуктов подкреплен научными публикациями в рецензируемых журналах."
        }
      ]
    },
    about: {
      title: "О нас",
      subtitle: "Научный подход к созданию премиальных биологически активных добавок",
      mainTitle: "Наша философия: добавки нового поколения",
      description: "Мы создаем не просто добавки, а продукты, которые делают твою жизнь лучше. Лучшее сырье? Это только начало. Настоящая ценность рождается, там где наука встречается с заботой о тебе и твоем комфорте.",
      whyTitle: "Почему выбирают нас?",
      whySubtitle: "Наши продукты для тех, кто ценит:",
      features: [
        {
          icon: "fas fa-bolt",
          title: "Эффективность",
          description: "Каждая добавка работает на результат, помогая тебе чувствовать себя лучше. Клинически подтвержденные формулы с доказанным действием."
        },
        {
          icon: "fas fa-palette",
          title: "Стильный дизайн",
          description: "Упаковка, которая радует глаз и приятна на ощупь. Мы уделяем внимание каждой детали, чтобы вам было приятно пользоваться нашими продуктами."
        },
        {
          icon: "fas fa-lock-open",
          title: "Открытость",
          description: "Наши баночки не пылятся в шкафу — они становятся ярким акцентом на твоем столе или в спортзале. Прозрачность состава и производства."
        }
      ]
    }
  });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

  const handleContentChange = (section, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleCardChange = (section, index, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [section === "home" ? "scienceCards" : "features"]: 
          prev[section][section === "home" ? "scienceCards" : "features"].map((card, i) => 
            i === index ? { ...card, [field]: value } : card
          )
      }
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // В реальном проекте здесь будет API запрос
      console.log("Сохранение контента:", content);
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Контент успешно сохранен!");
    } catch (error) {
      alert("Ошибка при сохранении контента");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>Управление контентом</h1>
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
            <Link href="/admin/orders" className="admin-nav-item">
              <i className="fas fa-shopping-cart"></i>
              <span>Заказы</span>
            </Link>
            <Link href="/admin/content" className="admin-nav-item active">
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
          <div className="content-tabs">
            <button 
              className={`content-tab ${activeTab === "home" ? "active" : ""}`}
              onClick={() => setActiveTab("home")}
            >
              <i className="fas fa-home"></i> Главная страница
            </button>
            <button 
              className={`content-tab ${activeTab === "about" ? "active" : ""}`}
              onClick={() => setActiveTab("about")}
            >
              <i className="fas fa-users"></i> О нас
            </button>
          </div>

          <div className="content-editor">
            {activeTab === "home" && (
              <div className="content-section">
                <h2>Главная страница</h2>
                
                <div className="form-section">
                  <h3>Hero секция</h3>
                  <div className="form-group">
                    <label>Заголовок</label>
                    <input
                      type="text"
                      value={content.home.heroTitle}
                      onChange={(e) => handleContentChange("home", "heroTitle", e.target.value)}
                      placeholder="Заголовок hero секции"
                    />
                  </div>
                  <div className="form-group">
                    <label>Подзаголовок</label>
                    <textarea
                      value={content.home.heroSubtitle}
                      onChange={(e) => handleContentChange("home", "heroSubtitle", e.target.value)}
                      rows="3"
                      placeholder="Описание hero секции"
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3>Научная секция</h3>
                  <div className="form-group">
                    <label>Заголовок</label>
                    <input
                      type="text"
                      value={content.home.scienceTitle}
                      onChange={(e) => handleContentChange("home", "scienceTitle", e.target.value)}
                      placeholder="Заголовок научной секции"
                    />
                  </div>
                  <div className="form-group">
                    <label>Подзаголовок</label>
                    <textarea
                      value={content.home.scienceSubtitle}
                      onChange={(e) => handleContentChange("home", "scienceSubtitle", e.target.value)}
                      rows="3"
                      placeholder="Описание научной секции"
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3>Карточки науки</h3>
                  {content.home.scienceCards.map((card, index) => (
                    <div key={index} className="card-editor">
                      <h4>Карточка {index + 1}</h4>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Иконка</label>
                          <select
                            value={card.icon}
                            onChange={(e) => handleCardChange("home", index, "icon", e.target.value)}
                          >
                            <option value="fas fa-microscope">Микроскоп</option>
                            <option value="fas fa-sync-alt">Синхронизация</option>
                            <option value="fas fa-book">Книга</option>
                            <option value="fas fa-flask">Колба</option>
                            <option value="fas fa-dna">ДНК</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Заголовок</label>
                          <input
                            type="text"
                            value={card.title}
                            onChange={(e) => handleCardChange("home", index, "title", e.target.value)}
                            placeholder="Заголовок карточки"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Описание</label>
                        <textarea
                          value={card.description}
                          onChange={(e) => handleCardChange("home", index, "description", e.target.value)}
                          rows="3"
                          placeholder="Описание карточки"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "about" && (
              <div className="content-section">
                <h2>Страница "О нас"</h2>
                
                <div className="form-section">
                  <h3>Основная информация</h3>
                  <div className="form-group">
                    <label>Заголовок страницы</label>
                    <input
                      type="text"
                      value={content.about.title}
                      onChange={(e) => handleContentChange("about", "title", e.target.value)}
                      placeholder="Заголовок страницы"
                    />
                  </div>
                  <div className="form-group">
                    <label>Подзаголовок</label>
                    <input
                      type="text"
                      value={content.about.subtitle}
                      onChange={(e) => handleContentChange("about", "subtitle", e.target.value)}
                      placeholder="Подзаголовок страницы"
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3>Основной контент</h3>
                  <div className="form-group">
                    <label>Главный заголовок</label>
                    <input
                      type="text"
                      value={content.about.mainTitle}
                      onChange={(e) => handleContentChange("about", "mainTitle", e.target.value)}
                      placeholder="Главный заголовок"
                    />
                  </div>
                  <div className="form-group">
                    <label>Описание</label>
                    <textarea
                      value={content.about.description}
                      onChange={(e) => handleContentChange("about", "description", e.target.value)}
                      rows="4"
                      placeholder="Основное описание"
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3>Особенности</h3>
                  <div className="form-group">
                    <label>Заголовок секции</label>
                    <input
                      type="text"
                      value={content.about.whyTitle}
                      onChange={(e) => handleContentChange("about", "whyTitle", e.target.value)}
                      placeholder="Заголовок секции особенностей"
                    />
                  </div>
                  <div className="form-group">
                    <label>Подзаголовок секции</label>
                    <input
                      type="text"
                      value={content.about.whySubtitle}
                      onChange={(e) => handleContentChange("about", "whySubtitle", e.target.value)}
                      placeholder="Подзаголовок секции особенностей"
                    />
                  </div>
                  
                  {content.about.features.map((feature, index) => (
                    <div key={index} className="card-editor">
                      <h4>Особенность {index + 1}</h4>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Иконка</label>
                          <select
                            value={feature.icon}
                            onChange={(e) => handleCardChange("about", index, "icon", e.target.value)}
                          >
                            <option value="fas fa-bolt">Молния</option>
                            <option value="fas fa-palette">Палитра</option>
                            <option value="fas fa-lock-open">Замок</option>
                            <option value="fas fa-heart">Сердце</option>
                            <option value="fas fa-star">Звезда</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Заголовок</label>
                          <input
                            type="text"
                            value={feature.title}
                            onChange={(e) => handleCardChange("about", index, "title", e.target.value)}
                            placeholder="Заголовок особенности"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Описание</label>
                        <textarea
                          value={feature.description}
                          onChange={(e) => handleCardChange("about", index, "description", e.target.value)}
                          rows="3"
                          placeholder="Описание особенности"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="content-actions">
              <button 
                onClick={handleSave}
                className="admin-save-btn"
                disabled={isLoading}
              >
                {isLoading ? "Сохранение..." : "Сохранить изменения"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


