import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import '../styles/pages/articles-list.css';

export const metadata = {
  title: 'Статьи | BioMorphX',
  description: 'Актуальные материалы от ведущих специалистов индустрии о незаменимых аминокислотах, BCAA, спортивном питании и здоровье.',
};

export default function ArticlesPage() {
  const articles = [
    {
      id: 'calcium-gluconate-guide',
      slug: 'calcium-gluconate-guide',
      title: 'Кальция глюконат: полное руководство по применению, питанию и безопасности',
      image: '/img/for _state5.png',
    },
    {
      id: 'proline-guide',
      slug: 'proline-guide',
      title: 'Роль пролина в организме: почему эта аминокислота важна для здоровья',
      image: '/img/for state_4.png',
    },
    {
      id: 'valine-guide',
      slug: 'valine-guide',
      title: 'Валин: полный гид по применению для спортсменов 2025',
      image: '/img/for state_3.png',
    },
    {
      id: 'leucine-guide',
      slug: 'leucine-guide',
      title: 'Лейцин: влияние на синтез белка и метаболизм мышц',
      image: '/img/leucine_st.png',
    },
    {
      id: 'threonine-guide',
      slug: 'threonine-guide',
      title: 'Что такое треонин? 7 важных фактов',
      image: '/img/for state_1.png',
    },
    {
      id: 'isoleucine-guide',
      slug: 'isoleucine-guide',
      title: 'Изолейцин: энергия и восстановление',
      image: '/img/for state_2.png',
    },
  ];

  return (
    <>
      <Header />
      
      {/* Hero секция */}
      <section className="articles-hero">
        <div className="container">
          <div className="articles-hero-content">
            <h1 className="articles-hero-title">Статьи</h1>
            <p className="articles-hero-subtitle">
              Актуальные материалы от ведущих специалистов индустрии
            </p>
          </div>
        </div>
      </section>

      {/* Список статей */}
      <section className="articles-list-section">
        <div className="container">
          <div className="articles-grid">
            {articles.map((article) => (
              <Link key={article.id} href={`/articles/${article.slug}`} className="articles-mini-card" aria-label={`${article.title} — перейти к статье`}>
                <div className="articles-mini-image">
                  <img src={article.image} alt={`${article.title} — статья`} />
                </div>
                <h3 className="articles-mini-title">{article.title}</h3>
              </Link>
            ))}
          </div>

          {/* Призыв к действию */}
          <div className="articles-cta">
            <div className="cta-card">
              <div className="cta-icon">
                <i className="fab fa-telegram"></i>
              </div>
              <h3 className="cta-title">Не хотите пропустить новые статьи?</h3>
              <p className="cta-text">
                Подпишитесь на наш Telegram-канал — там мы публикуем эксклюзивные материалы и делимся новыми исследованиями.
              </p>
              <a href="https://t.me/biomorphx" target="_blank" rel="noopener noreferrer" className="cta-button">
                <i className="fab fa-telegram"></i>
                Подписаться на канал
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

