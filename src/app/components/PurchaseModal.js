"use client";

import { useCart } from '../../contexts/CartContext';
import { useRouter } from 'next/navigation';

export default function PurchaseModal({ isOpen, onClose, product }) {
    const { addToCart } = useCart();
    const router = useRouter();

    if (!isOpen || !product) return null;

    const handleContinueShopping = () => {
        addToCart(product);
        onClose();
    };

    const handleCheckout = () => {
        addToCart(product);
        onClose();
        router.push('/checkout');
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="purchase-modal-overlay" onClick={handleOverlayClick}>
            <div className="purchase-modal">
                <button className="purchase-modal-close" onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>
                
                <div className="purchase-modal-header">
                    <h2 className="purchase-modal-title">Товар добавлен в корзину!</h2>
                    <p className="purchase-modal-subtitle">
                        Выберите, что хотите сделать дальше
                    </p>
                </div>

                <div className="purchase-modal-product">
                    <div className="purchase-modal-product-image">
                        <img src={product.image} alt={product.name} />
                    </div>
                    <div className="purchase-modal-product-info">
                        <div className="purchase-modal-product-name">{product.name}</div>
                        <div className="purchase-modal-product-price">{product.price} ₽</div>
                    </div>
                </div>

                <div className="purchase-modal-actions">
                    <button 
                        className="purchase-modal-btn continue"
                        onClick={handleContinueShopping}
                    >
                        <i className="fas fa-shopping-cart"></i> Продолжить покупки
                    </button>
                    <button 
                        className="purchase-modal-btn checkout"
                        onClick={handleCheckout}
                    >
                        <i className="fas fa-credit-card"></i> Оформить заказ
                    </button>
                </div>
            </div>
        </div>
    );
}
