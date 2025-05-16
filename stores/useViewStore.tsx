import { create } from 'zustand';

interface ViewState {
  angle: number;
  setAngle: (angle: number) => void;
<<<<<<< HEAD
}>((set) => ({
  angle: 45,
  setAngle: (a) => set({ angle: a }),
=======
  isTopView: boolean;
  setIsTopView: (isTopView: boolean) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  angle: 45,
  setAngle: (angle) => set({ angle }),
  isTopView: false,
  setIsTopView: (isTopView) => set({ isTopView }),
>>>>>>> afda6368066c4f34b18ed0614f5b6cca40c2183c
}));
