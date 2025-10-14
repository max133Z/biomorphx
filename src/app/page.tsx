import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'BioMorphX — Научные решения для вашего здоровья | Аминокислоты и БАДы',
  description: 'Инновационные биологически активные добавки премиум-класса: аминокислоты, BCAA, витамины и минералы. Научный подход, клинически подтвержденная эффективность, доставка по России.',
  keywords: 'биологически активные добавки, БАДы, аминокислоты, BCAA, L-треонин, L-изолейцин, L-лейцин, спортивное питание, здоровье, витамины',
  openGraph: {
    title: 'BioMorphX — Научные решения для вашего здоровья',
    description: 'Инновационные биологически активные добавки для поддержания оптимального здоровья',
    type: 'website',
    images: ['/img/image_1.jpg'],
  },
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  return <HomeClient />;
}

