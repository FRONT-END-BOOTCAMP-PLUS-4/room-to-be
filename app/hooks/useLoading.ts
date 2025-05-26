import { useCallback } from 'react';

import { useLoadingStore } from '@/stores/useLoadingStore';

export function useLoading() {
  const { isLoading, setLoading } = useLoadingStore();

  const loading = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      message?: string,
      minimumMs: number = 800,
    ): Promise<T> => {
      const startTime = Date.now();

      try {
        setLoading(true, message);
        const result = await asyncFn();

        const elapsed = Date.now() - startTime;
        if (elapsed < minimumMs) {
          await new Promise((resolve) =>
            setTimeout(resolve, minimumMs - elapsed),
          );
        }

        return result;
      } finally {
        setLoading(false);
      }
    },
    [setLoading],
  );

  return {
    isLoading,
    setLoading,
    loading,
  };
}
