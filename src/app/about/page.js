import Header from "../../components/Header";
import Footer from "../../components/Footer";

export const metadata = {
  title: 'О нас — BioMorphX | Научный подход к здоровью',
  description: 'BioMorphX — команда профессионалов, создающих инновационные биологически активные добавки на основе научных исследований. Эффективность, стильный дизайн и открытость.',
  keywords: 'о нас, BioMorphX, биологически активные добавки, научный подход, команда, миссия, производство БАДов',
  openGraph: {
    title: 'О нас — BioMorphX',
    description: 'Узнайте о команде BioMorphX и нашем научном подходе к созданию БАДов',
    type: 'website',
  },
};

export default function About() {
  return (
    <>
      <Header />
      
      <section className="about-page-hero">
        <div className="container">
          <div className="page-hero-content">
            <h1>О нас</h1>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <h2>Наша философия: добавки нового поколения</h2>
            <p>Мы создаем не просто добавки, а продукты, которые делают твою жизнь лучше. Лучшее сырье? Это только начало. Настоящая ценность рождается, там где наука встречается с заботой о тебе и твоем комфорте.</p>
            
            <h2 style={{marginTop: '60px'}}>Почему выбирают нас?</h2>
            <p>Наши продукты для тех, кто ценит:</p>
            
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-bolt"></i>
                </div>
                <h3>Эффективность</h3>
                <p>Каждая добавка работает на результат, помогая тебе чувствовать себя лучше. Клинически подтвержденные формулы с доказанным действием.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-palette"></i>
                </div>
                <h3>Стильный дизайн</h3>
                <p>Упаковка, которая радует глаз и приятна на ощупь. Мы уделяем внимание каждой детали, чтобы вам было приятно пользоваться нашими продуктами.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-lock-open"></i>
                </div>
                <h3>Открытость</h3>
                <p>Наши баночки не пылятся в шкафу — они становятся ярким акцентом на твоем столе или в спортзале. Прозрачность состава и производства.</p>
              </div>
            </div>
            
            <p style={{marginTop: '40px'}}>Даже мелочи вокруг тебя влияют на твое настроение и энергию. Поэтому наши добавки не только поддерживают твое здоровье, но и гармонично вписываются в твое пространство.</p>
            <p>Это новый подход к добавкам: где эффективность сочетается с эстетикой и заботой о тебе.</p>
            <p style={{fontWeight: 600, color: 'var(--accent)', marginTop: '30px'}}>Будь здоров. Будь с нами.</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
