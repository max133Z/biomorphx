import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Политика обработки заказов — BioMorphX',
  description: 'Правила и условия обработки заказов BioMorphX: сроки обработки, подтверждение заказа, возврат и обмен товара. Прозрачные условия работы.',
  keywords: 'обработка заказов, правила заказа, возврат товара, условия продажи, политика возврата',
  openGraph: {
    title: 'Политика обработки заказов — BioMorphX',
    description: 'Правила оформления и обработки заказов',
    type: 'website',
  },
};

export default function OrderProcessingPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

