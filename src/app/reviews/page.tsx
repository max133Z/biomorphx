import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ReviewCard from '../../components/ReviewCard';
import reviews from '../../data/reviews';
import '../styles/pages/reviews-page.css';

export const metadata = {
  title: 'Отзывы клиентов | BioMorphX',
  description: 'Реальные отзывы от людей, которые уже попробовали наши продукты и получили результаты.',
};

export default function ReviewsPage() {
  return (
    <>
      <Header />
      
      {/* Hero секция */}
      <section className="reviews-page-hero">
        <div className="container">
          <div className="reviews-page-hero-content">
            <h1 className="reviews-page-title">Отзывы наших клиентов</h1>
            <p className="reviews-page-subtitle">
              Реальные отзывы от людей, которые уже попробовали наши продукты и получили результаты
            </p>
          </div>
        </div>
      </section>

      {/* Список отзывов */}
      <section className="reviews-page-section">
        <div className="container">
          <div className="reviews-page-grid">
            {reviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

