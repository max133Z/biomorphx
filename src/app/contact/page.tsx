import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Контакты — BioMorphX | Свяжитесь с нами',
  description: 'Свяжитесь с BioMorphX: телефон +7 904 638 94 16, email, форма обратной связи. Консультации по выбору БАДов и аминокислот. Адрес в Санкт-Петербурге. Ответим на все ваши вопросы.',
  keywords: 'контакты BioMorphX, телефон, email, обратная связь, консультация по БАДам, адрес Санкт-Петербург',
  openGraph: {
    title: 'Контакты — BioMorphX',
    description: 'Свяжитесь с нами для консультации и заказа продукции',
    type: 'website',
  },
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}

