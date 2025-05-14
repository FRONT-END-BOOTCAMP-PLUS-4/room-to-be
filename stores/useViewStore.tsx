// features/simulator/viewStore.ts
import { create } from 'zustand';

interface ViewState {
  angle: number;
  setAngle: (angle: number) => void;
  lastNormalAngle: number;
  setLastNormalAngle: (angle: number) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  angle: 45,
  setAngle: (angle) => set({ angle }),
  lastNormalAngle: 45,
  setLastNormalAngle: (lastNormalAngle) => set({ lastNormalAngle }),
}));
