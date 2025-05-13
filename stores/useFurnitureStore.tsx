import { create } from 'zustand';

interface FurnitureInfo {
  id: string;
  name: string;
  type: string;
  modelUrl: string;
  thumbnailUrl: string;
  scale: number;
  rotationY: number;
}

interface FurnitureStore {
  selectedFurniture: FurnitureInfo | null;
  selectFurniture: (info: FurnitureInfo) => void;
  clearSelection: () => void;
}

export const useFurnitureStore = create<FurnitureStore>((set) => ({
  selectedFurniture: null,
  selectFurniture: (info) => set({ selectedFurniture: info }),
  clearSelection: () => set({ selectedFurniture: null }),
}));