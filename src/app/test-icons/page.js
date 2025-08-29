export default function TestIcons() {
  return (
    <div style={{ padding: '50px', background: '#0d1a1a', color: 'white', minHeight: '100vh' }}>
      <h1>Тест иконок Font Awesome</h1>
      
      <div style={{ margin: '20px 0' }}>
        <h2>Иконки из продуктов:</h2>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', margin: '20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fas fa-shield-alt" style={{ fontSize: '24px', color: '#e6b325' }}></i>
            <span>fas fa-shield-alt</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fas fa-microscope" style={{ fontSize: '24px', color: '#e6b325' }}></i>
            <span>fas fa-microscope</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fas fa-lungs" style={{ fontSize: '24px', color: '#e6b325' }}></i>
            <span>fas fa-lungs</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fas fa-spa" style={{ fontSize: '24px', color: '#e6b325' }}></i>
            <span>fas fa-spa</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fas fa-bolt" style={{ fontSize: '24px', color: '#e6b325' }}></i>
            <span>fas fa-bolt</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fas fa-running" style={{ fontSize: '24px', color: '#e6b325' }}></i>
            <span>fas fa-running</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fas fa-heart" style={{ fontSize: '24px', color: '#e6b325' }}></i>
            <span>fas fa-heart</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fas fa-dumbbell" style={{ fontSize: '24px', color: '#e6b325' }}></i>
            <span>fas fa-dumbbell</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fas fa-dna" style={{ fontSize: '24px', color: '#e6b325' }}></i>
            <span>fas fa-dna</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fas fa-fire" style={{ fontSize: '24px', color: '#e6b325' }}></i>
            <span>fas fa-fire</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fas fa-leaf" style={{ fontSize: '24px', color: '#e6b325' }}></i>
            <span>fas fa-leaf</span>
          </div>
        </div>
      </div>

      <div style={{ margin: '20px 0' }}>
        <h2>Другие иконки:</h2>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', margin: '20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fas fa-home" style={{ fontSize: '24px', color: '#5aac7d' }}></i>
            <span>fas fa-home</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fas fa-capsules" style={{ fontSize: '24px', color: '#5aac7d' }}></i>
            <span>fas fa-capsules</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fas fa-shopping-cart" style={{ fontSize: '24px', color: '#5aac7d' }}></i>
            <span>fas fa-shopping-cart</span>
          </div>
        </div>
      </div>

      <div style={{ margin: '20px 0' }}>
        <h2>Иконки в блоках (как на детальной странице):</h2>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', margin: '20px 0' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            background: 'linear-gradient(135deg, #e6b325, #ff9e4f)', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '20px',
            color: '#000000'
          }}>
            <i className="fas fa-shield-alt" style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              fontSize: '20px',
              color: '#000000',
              fontWeight: '600'
            }}></i>
          </div>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            background: 'linear-gradient(135deg, #e6b325, #ff9e4f)', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '20px',
            color: '#000000'
          }}>
            <i className="fas fa-microscope" style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              fontSize: '20px',
              color: '#000000',
              fontWeight: '600'
            }}></i>
          </div>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            background: 'linear-gradient(135deg, #e6b325, #ff9e4f)', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '20px',
            color: '#000000'
          }}>
            <i className="fas fa-lungs" style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              fontSize: '20px',
              color: '#000000',
              fontWeight: '600'
            }}></i>
          </div>
        </div>
      </div>

      <a href="/" style={{ color: '#e6b325', textDecoration: 'none' }}>
        <i className="fas fa-arrow-left"></i> Вернуться на главную
      </a>
    </div>
  );
}
