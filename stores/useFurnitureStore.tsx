
import { FurnitureStoreProps } from '@/app/types/furniture';
import { create } from 'zustand';

interface FurnitureStore {
  furnitures: FurnitureStoreProps[];
  selectedFurnitureId: string | null;

  selectFurniture: (id: string) => void;
  clearSelection: () => void;

  addFurniture: (info: FurnitureStoreProps) => void;
  updateFurniture: (id: string, updated: Partial<FurnitureStoreProps>) => void;
  removeFurniture: (id: string) => void;

  setFurnitures: (items: FurnitureStoreProps[]) => void;
}

export const useFurnitureStore = create<FurnitureStore>((set) => ({
  furnitures: [],
  selectedFurnitureId: null,

  selectFurniture: (id) => set({ selectedFurnitureId: id }),
  clearSelection: () => set({ selectedFurnitureId: null }),

  addFurniture: (info) =>
    set((state) => ({
      furnitures: [...state.furnitures, info],
    })),

  updateFurniture: (id, updated) =>
    set((state) => ({
      furnitures: state.furnitures.map((f) =>
        f.id === id ? { ...f, ...updated } : f,
      ),
    })),

  removeFurniture: (id) =>
    set((state) => ({
      furnitures: state.furnitures.filter((f) => f.id !== id),
    })),

  setFurnitures: (items) => set({ furnitures: items }),
}));