import type { Metadata } from 'next';
import CheckoutClient from './CheckoutClient';

export const metadata: Metadata = {
  title: 'Оформление заказа — BioMorphX | Корзина',
  description: 'Оформите заказ аминокислот и БАДов: укажите данные доставки, выберите способ оплаты. Быстрое оформление, безопасная оплата.',
  keywords: 'оформить заказ, купить БАДы, корзина, заказ аминокислот, оформление заказа',
  robots: 'noindex, nofollow', // Страница корзины не должна индексироваться
  openGraph: {
    title: 'Оформление заказа — BioMorphX',
    description: 'Завершите оформление заказа',
    type: 'website',
  },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}

