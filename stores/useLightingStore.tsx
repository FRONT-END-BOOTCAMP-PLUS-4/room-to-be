import { create } from 'zustand';

interface LightingState {
  isDay: boolean;
  setIsDay: (isDay: boolean) => void;
}

export const useLightingStore = create<LightingState>((set) => ({
  isDay: true,
  setIsDay: (isDay) => set({ isDay }),
}));
