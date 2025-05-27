'use client';

import { useLoadingStore } from '@/stores/useLoadingStore';

import Loading from './Loading';

export default function GlobalLoadingProvider() {
  const { isLoading } = useLoadingStore();

  if (!isLoading) return null;

  return <Loading />;
}
