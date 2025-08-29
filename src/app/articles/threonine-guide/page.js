import React from 'react';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function ThreonineGuidePage() {
  const tableOfContents = [
    { id: 'what-is-threonine', title: 'Что такое треонин?' },
    { id: 'importance', title: 'Важность треонина' },
    { id: 'benefits', title: 'Каковы преимущества треонина?' },
    { id: 'deficiency', title: 'Признаки дефицита треонина' },
    { id: 'foods', title: 'Какие продукты богаты треонином?' },
    { id: 'dosage', title: 'Дозировка треонина: сколько следует принимать каждый день?' },
    { id: 'side-effects', title: 'Побочные эффекты треонина' },
    { id: 'interactions', title: 'Могу ли я принимать треонин вместе с другими лекарствами?' },
    { id: 'conclusion', title: 'Итог' }
  ];

  return (
    <>
      <Header />
      
      {/* Заголовок статьи */}
      <header className="article-header">
          <div className="container">
            <nav className="breadcrumb">
              <Link href="/">Главная</Link>
              <span> / </span>
              <Link href="/articles">Статьи</Link>
              <span> / </span>
              <span>Треонин</span>
            </nav>
            
            <div className="article-date">16 сентября 2024</div>
            <div className="article-read-time">8 мин чтения</div>
            
            <h1 className="article-title">
              Что такое треонин? 7 важных фактов о незаменимой аминокислоте для здоровья
            </h1>
            
            <div className="article-author">
              <div className="author-info">
                <div className="author-avatar">👩‍⚕️</div>
                <div className="author-details">
                  <div className="author-name">Кэролайн Никс</div>
                  <div className="author-credentials">Член NASM CPT</div>
                </div>
              </div>
            </div>
            
            <div className="article-excerpt">
              <p>
                Без этой незаменимой аминокислоты наш организм развалился бы. Она поддерживает эластичность соединительной ткани, крепость костей и оптимальное функционирование нервной системы. Узнайте 7 важных фактов о треонине, которые вам нужно знать для здоровья.
              </p>
            </div>
          </div>
        </header>

        {/* Оглавление */}
        <section className="table-of-contents">
          <div className="container">
            <div className="toc-card">
              <h2 className="toc-title">Оглавление</h2>
              <nav className="toc-nav">
                <ul>
                  {tableOfContents.map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`} className="toc-link">
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </section>

        {/* Основной контент */}
        <main className="article-content">
          <div className="container">
            <div className="content-wrapper">
              <article className="article-body">
                <section id="what-is-threonine" className="article-section">
                  <h2>Что такое треонин?</h2>
                  <p>
                    Треонин, или L-треонин, — одна из 20 аминокислот. Он входит в состав белков зубов, эмали, коллагена и эластина. Он даже содержится в больших количествах в сердце. Проще говоря, это мощный строительный материал, который поддерживает тело (и сердце) сильным, здоровым и молодым.
                  </p>
                  <p>
                    Треонин — незаменимая аминокислота, то есть организм не может вырабатывать её самостоятельно. Поэтому его необходимо получать из пищи или пищевых добавок.
                  </p>
                </section>

                <section id="importance" className="article-section">
                  <h2>Важность треонина</h2>
                  <p>
                    Треонин создает две другие важные аминокислоты — глицин и серин. Эти аминокислоты играют решающую роль в формировании мышечной ткани, коллагена и эластина.
                  </p>
                </section>

                <section id="benefits" className="article-section">
                  <h2>Каковы преимущества треонина?</h2>
                  <p>
                    L-треонин — важная аминокислота для центральной нервной системы, иммунной системы, печени и т. д.
                  </p>
                  <p>Полный список потенциальных преимуществ для здоровья включает:</p>
                  <ul className="benefits-list">
                    <li>Может метаболизировать жир</li>
                    <li>Может предотвратить накопление жира в печени</li>
                    <li>Может облегчить расстройство желудка</li>
                    <li>Может уменьшить симптомы тревоги и легкой депрессии</li>
                    <li>Может способствовать здоровью соединительной ткани и костей</li>
                    <li>Помогает сохранить здоровье зубов</li>
                    <li>Может облегчить симптомы целиакии</li>
                    <li>Может способствовать сну</li>
                  </ul>
                </section>

                <section id="deficiency" className="article-section">
                  <h2>Признаки дефицита треонина</h2>
                  <p>Без треонина возникает ряд проблем, в том числе:</p>
                  <ul className="deficiency-list">
                    <li>Желудочно-кишечные расстройства</li>
                    <li>Неврологическая дисфункция</li>
                    <li>Расстройство нервной системы</li>
                    <li>Уменьшает рост тонкого кишечника, печени и скелетных мышц</li>
                    <li>Ожирение</li>
                    <li>Сердечная недостаточность</li>
                  </ul>
                </section>

                <section id="foods" className="article-section">
                  <h2>Какие продукты богаты треонином?</h2>
                  <p>Продукты, богатые треонином, включают:</p>
                  <div className="foods-grid">
                    <div className="food-category">
                      <h3>Мясо и рыба</h3>
                      <ul>
                        <li>Постная говядина травяного откорма</li>
                        <li>Курица, выращенная на пастбищах</li>
                        <li>Свинина</li>
                        <li>Тунец</li>
                      </ul>
                    </div>
                    <div className="food-category">
                      <h3>Растительные источники</h3>
                      <ul>
                        <li>Зеленый горошек</li>
                        <li>Яйца</li>
                        <li>Семена</li>
                        <li>Орехи</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section id="dosage" className="article-section">
                  <h2>Дозировка треонина: сколько следует принимать каждый день?</h2>
                  <p>
                    Рекомендуемое количество треонина, которое человек должен получать из рациона, составляет от 400 до более 1000 миллиграммов в день. Это количество зависит от пола, возраста и этапа жизни.
                  </p>
                  <p>
                    При приеме в лечебных целях в форме капсул треонин в дозах до 4 граммов в день в течение 12 месяцев считается безопасным.
                  </p>
                </section>

                <section id="side-effects" className="article-section">
                  <h2>Побочные эффекты треонина</h2>
                  <p>
                    У некоторых людей наблюдаются незначительные побочные эффекты, такие как расстройство желудка, головная боль, тошнота и кожная сыпь.
                  </p>
                  <div className="warning-box">
                    <strong>Важно:</strong> У пациентов с БАС (боковым амиотрофическим склерозом) треонин может представлять опасность для функции лёгких.
                  </div>
                </section>

                <section id="interactions" className="article-section">
                  <h2>Могу ли я принимать треонин вместе с другими лекарствами?</h2>
                  <p>
                    Единственный препарат, который негативно взаимодействует с треонином, — это мемантин (или «Наменда»), препарат для лечения болезни Альцгеймера. Если вы принимаете этот препарат, проконсультируйтесь с врачом.
                  </p>
                </section>

                                 <section id="conclusion" className="article-section">
                   <h2>Итог</h2>
                   <p>
                     Треонин — незаменимая аминокислота, играющая ключевую роль в метаболизме ключевых питательных веществ, поддержании здоровья кишечника и обеспечении качественного сна. Его необходимо получать из продуктов, богатых белком, или в виде пищевой добавки.
                   </p>
                 </section>
                 
                 <section className="article-section">
                   <h2>Источник</h2>
                   <p>
                     <a href="https://nativepath.com/blogs/nutrition/threonine-important-health-facts-to-know-about-this-essential-amino-acid" target="_blank" rel="noopener noreferrer">
                       NativePath - What Is Threonine? Essential Amino Acid Health Guide
                     </a>
                   </p>
                 </section>
               </article>

              {/* Боковая панель */}
              <aside className="article-sidebar">
                <div className="sidebar-card">
                  <h3>Популярные статьи</h3>
                  <ul className="sidebar-articles">
                    <li>
                      <Link href="/articles/bcaa-science">Роль BCAA в наборе мышечной массы</Link>
                    </li>
                    <li>
                      <Link href="/articles/creatine-myths">Креатин: мифы и факты</Link>
                    </li>
                  </ul>
                </div>
                
                <div className="sidebar-card">
                  <h3>Связанные продукты</h3>
                  <a href="/products/l-threonine" className="product-card product-card-clickable">
                    <img src="/img/L-Threonine.png" alt="L-Threonine" />
                    <h4>L-Threonine</h4>
                    <p>Незаменимая аминокислота для здоровья кожи, суставов и иммунной системы</p>
                                         <button className="btn"><i className="fas fa-cart-plus"></i> Купить</button>
                  </a>
                </div>
              </aside>
            </div>
          </div>
        </main>
      <Footer />
    </>
  );
}
