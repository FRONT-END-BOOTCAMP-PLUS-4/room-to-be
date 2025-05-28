'use client';

import dynamic from 'next/dynamic';

import { useLoadingStore } from '@/stores/useLoadingStore';

const ClientLoading = dynamic(() => import('./Loading'), { ssr: false });

export default function GlobalLoadingProvider() {
  const { isLoading } = useLoadingStore();

  if (!isLoading) return null;

  return <ClientLoading />;
}
