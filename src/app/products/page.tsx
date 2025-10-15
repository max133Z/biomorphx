import type { Metadata } from 'next';
import ProductsClient from './ProductsClient';

export const metadata: Metadata = {
  title: 'Каталог продуктов — BioMorphX | Аминокислоты и БАДы премиум-класса',
  description: 'Широкий выбор аминокислот и биологически активных добавок премиум-класса: BCAA, L-треонин, L-изолейцин, L-лейцин, L-валин, L-цистеин, L-пролин, L-фенилаланин и другие. Высокое качество, научный подход.',
  keywords: 'купить аминокислоты, BCAA купить, L-треонин, L-изолейцин, L-лейцин, БАДы, спортивное питание, аминокислоты для спорта, купить спортпит',
  openGraph: {
    title: 'Каталог продуктов — BioMorphX',
    description: 'Аминокислоты и БАДы высокого качества для спортсменов и здорового образа жизни',
    type: 'website',
  },
  alternates: {
    canonical: '/products',
  },
};

export default function ProductsPage() {
  return <ProductsClient />;
}

