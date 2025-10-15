import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Админ-панель — BioMorphX',
  description: 'Панель управления BioMorphX',
  robots: 'noindex, nofollow', // Админка не должна индексироваться
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

