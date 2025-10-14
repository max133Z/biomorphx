const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <h3>BioMorphX</h3>
            <p style={{color: 'var(--secondary)', marginBottom: '20px'}}>Научный подход к вашему здоровью.</p>
          </div>
          <div className="footer-column">
            <h3>Продукты</h3>
            <ul>
              <li><a href="/products"><i className="fas fa-list"></i> Все продукты</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Компания</h3>
            <ul>
              <li><a href="/about"><i className="fas fa-users"></i> О нас</a></li>
              <li><a href="/articles"><i className="fas fa-book"></i> Статьи</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Поддержка</h3>
            <ul>
              <li><a href="/delivery"><i className="fas fa-truck"></i> Доставка</a></li>
              <li><a href="/contact"><i className="fas fa-envelope"></i> Контакты</a></li>
              <li><a href="/order-processing-policy"><i className="fas fa-shield-alt"></i> Политика конфиденциальности</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 BioMorphX. Все права защищены. Информация на сайте не является медицинской рекомендацией. Проконсультируйтесь со специалистом перед применением.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
