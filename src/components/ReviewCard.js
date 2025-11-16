import React from 'react';

const ReviewCard = ({ review }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i 
        key={index} 
        className={`fas fa-star ${index < rating ? 'star-filled' : 'star-empty'}`}
      />
    ));
  };

  const AvatarIcon = () => (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" 
        fill="currentColor"
      />
      <path 
        d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" 
        fill="currentColor"
      />
    </svg>
  );

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="reviewer-info">
          <div className="reviewer-avatar">
            <div className="avatar-icon">
              <AvatarIcon />
            </div>
          </div>
          <div className="reviewer-details">
            <h4 className="reviewer-name">{review.name}</h4>
            <div className="review-product">
              <span className="product-label">о продукте:</span>
              <span className="product-name">{review.product}</span>
            </div>
            <div className="review-stars">
              {renderStars(review.rating)}
            </div>
          </div>
        </div>
      </div>
      <div className="review-content">
        <p className="review-text">{review.text}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
