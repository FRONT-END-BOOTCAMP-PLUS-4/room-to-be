import { create } from 'zustand';

interface FurnitureInfo {
  id: string;
  name: string;
  thumbnailUrl: string;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  positionX: number;
  positionY: number;
  positionZ: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  originalScaleX: number;
  originalScaleY: number;
  originalScaleZ: number;
  originalBaseX: number;
  originalBaseY: number;
  originalBaseZ: number;
  rotationY: number;
}

interface FurnitureStore {
  selectedFurniture: FurnitureInfo | null;
  selectFurniture: (info: FurnitureInfo) => void;
  clearSelection: () => void;
  updateSelectedFurniture: (updated: Partial<FurnitureInfo>) => void;
}

export const useFurnitureStore = create<FurnitureStore>((set) => ({
  selectedFurniture: null,
  selectFurniture: (info) => set({ selectedFurniture: info }),
  clearSelection: () => set({ selectedFurniture: null }),
  updateSelectedFurniture: (updated) =>
    set((state) => {
      if (!state.selectedFurniture) return {};
      return {
        selectedFurniture: {
          ...state.selectedFurniture,
          ...updated,
        },
      };
    }),
}));
