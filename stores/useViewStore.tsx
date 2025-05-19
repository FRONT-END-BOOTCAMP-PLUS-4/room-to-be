import { create } from 'zustand';

interface ViewState {
  angle: number;
  setAngle: (angle: number) => void;
  isTopView: boolean;
  setIsTopView: (isTopView: boolean) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  angle: 45,
  setAngle: (angle) => set({ angle }),
  isTopView: false,
  setIsTopView: (isTopView) => set({ isTopView }),
}));
