import type { Metadata } from 'next';
import { Kelly_Slab, Prosto_One } from 'next/font/google';
import './globals.css';
import ExternalResources from '../components/ExternalResources';
import CartWrapper from '../components/CartWrapper';

// Импорты компонентов
import './styles/components/header.css';
import './styles/components/footer.css';
import './styles/components/buttons.css';
import './styles/components/product-card.css';
import './styles/components/image-modal.css';
import './styles/components/review-card.css';

// Импорты страниц
import './styles/pages/home.css';
import './styles/pages/product-detail.css';
import './styles/pages/about.css';
import './styles/pages/delivery.css';
import './styles/pages/checkout-page.css';

// Импорты адаптивных стилей
import './styles/responsive/mobile.css';
import './styles/responsive/tablet.css';
import './styles/responsive/desktop.css';

const kellySlab = Kelly_Slab({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-kelly-slab',
  display: 'swap',
});

const prostoOne = Prosto_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-prosto-one',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BioMorphX - Научные решения для вашего здоровья',
  description: 'Инновационные биологически активные добавки, разработанные на основе последних научных исследований для поддержания оптимального здоровья.',
  keywords: 'БАД, добавки, здоровье, аминокислоты, витамины, минералы',
  authors: [{ name: 'BioMorphX Team' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  robots: 'index, follow',
  openGraph: {
    title: 'BioMorphX - Научные решения для вашего здоровья',
    description: 'Инновационные биологически активные добавки для поддержания оптимального здоровья.',
    type: 'website',
    locale: 'ru_RU',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        {/* Favicon и иконки обрабатываются автоматически из src/app/ */}
        
        {/* Preload критических ресурсов */}
        <link rel="preload" href="/img/L-Threonine.png" as="image" />
        <link rel="preload" href="/img/L-Proline.png" as="image" />
        <link rel="preload" href="/img/L-Phenilalanine.png" as="image" />
        <link rel="preload" href="/img/L-valine.png" as="image" />
        <link rel="preload" href="/img/L-Leucine.png" as="image" />
        <link rel="preload" href="/img/L-Isoleucine.png" as="image" />
        <link rel="preload" href="/img/L-Cysteine.png" as="image" />
        <link rel="preload" href="/img/Calcium-D-Gluconate.png" as="image" />
        <link rel="preload" href="/img/Postassium Citrate.png" as="image" />
        <link rel="preload" href="/img/Zinc.png" as="image" />
        <link rel="preload" href="/img/Sodium Alginate.png" as="image" />
        
        {/* DNS prefetch для внешних ресурсов */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
        
        {/* Preconnect для критических доменов */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Мета-теги для оптимизации */}
        <meta name="theme-color" content="#1a1f4a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BioMorphX" />
        
        {/* Оптимизация для мобильных устройств */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${kellySlab.variable} ${prostoOne.variable}`}>
        <ExternalResources />
        <CartWrapper>
          {children}
        </CartWrapper>
      </body>
    </html>
  );
}
