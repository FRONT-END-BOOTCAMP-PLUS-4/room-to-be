// features/simulator/viewStore.ts
import { create } from 'zustand';

export const useViewStore = create<{
  angle: number;
  setAngle: (angle: number) => void;
}>((set) => ({
  angle: 45,
  setAngle: (a) => set({ angle: a }),
}));

