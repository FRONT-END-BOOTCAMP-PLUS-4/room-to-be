import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LightingState {
  isDay: boolean;
  setIsDay: (isDay: boolean) => void;
}

export const useLightingStore = create<LightingState>()(
  persist(
    (set) => ({
      isDay: true,
      setIsDay: (isDay) => set({ isDay }),
    }),
    {
      name: 'lighting-storage',
      partialize: (state) => ({
        isDay: state.isDay,
      }),
    },
  ),
);
