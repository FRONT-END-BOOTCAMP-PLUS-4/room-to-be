import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WallDirection = 'front' | 'right' | 'back' | 'left';

interface ViewState {
  angle: number;
  setAngle: (angle: number) => void;
  isTopView: boolean;
  setIsTopView: (isTopView: boolean) => void;
  visibleWalls: WallDirection[];
  setVisibleWalls: (walls: WallDirection[]) => void;
}

export const useViewStore = create<ViewState>()(
  persist(
    (set) => ({
      angle: 45,
      setAngle: (angle) => set({ angle }),
      isTopView: false,
      setIsTopView: (isTopView) => set({ isTopView }),
      visibleWalls: [],
      setVisibleWalls: (walls) => set({ visibleWalls: walls }),
    }),
    {
      name: 'view-storage',
      partialize: (state) => ({
        angle: state.angle,
        isTopView: state.isTopView,
        visibleWalls: state.visibleWalls,
      }),
    },
  ),
);
