import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ViewState {
  angle: number;
  setAngle: (angle: number) => void;
  isTopView: boolean;
  setIsTopView: (isTopView: boolean) => void;
}

export const useViewStore = create<ViewState>()(
  persist(
    (set) => ({
      angle: 45,
      setAngle: (angle) => set({ angle }),
      isTopView: false,
      setIsTopView: (isTopView) => set({ isTopView }),
    }),
    {
      name: 'view-storage',
      partialize: (state) => ({
        angle: state.angle,
        isTopView: state.isTopView,
      }),
    },
  ),
);
