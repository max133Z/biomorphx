import type { Metadata } from 'next';
import products from '../../../data/products';
import ProductDetailClient from './ProductDetailClient';

// Генерация статических путей для всех продуктов (SSG)
export async function generateStaticParams() {
  return products.map((product) => ({
    productId: product.id,
  }));
}

// Динамическая генерация metadata для каждого продукта
export async function generateMetadata({ params }: { params: { productId: string } }): Promise<Metadata> {
  const product = products.find((p) => p.id === params.productId);

  if (!product) {
    return {
      title: 'Продукт не найден — BioMorphX',
      description: 'Запрашиваемый продукт не найден',
    };
  }

  // Создаем SEO-оптимизированный description
  const firstBenefit = product.keyBenefits?.[0] || product.subtitle || '';
  const seoDescription = `${product.longDescription || product.subtitle} ${firstBenefit}`.substring(0, 160);

  return {
    title: `${product.name} — купить в BioMorphX | ${product.quantity}`,
    description: seoDescription,
    keywords: `${product.name}, купить ${product.name}, ${product.name.toLowerCase()}, аминокислоты, БАДы, спортивное питание, добавки для спорта`,
    openGraph: {
      title: `${product.name} — BioMorphX`,
      description: product.subtitle || product.longDescription,
      images: [product.image],
      type: 'website',
    },
    alternates: {
      canonical: `/products/${product.id}`,
    },
  };
}

export default function ProductDetailPage({ params }: { params: { productId: string } }) {
  const product = products.find((p) => p.id === params.productId);

  return <ProductDetailClient product={product} />;
}

