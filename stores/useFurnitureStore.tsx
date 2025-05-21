import { create } from 'zustand';

import { FurnitureStoreInfo } from '@/app/types/furniture';

interface FurnitureStore {
  furnitures: FurnitureStoreInfo[];
  selectedFurnitureId: string | null;
  prevFurnitureStates: Record<string, FurnitureStoreInfo | null>;

  selectFurniture: (id: string) => void;
  clearSelection: () => void;

  addFurniture: (info: FurnitureStoreInfo) => void;
  updateFurniture: (id: string, updated: Partial<FurnitureStoreInfo>) => void;
  removeFurniture: (id: string) => void;

  setFurnitures: (items: FurnitureStoreInfo[]) => void;

  undoFurniture: (id: string) => void;
}

export const useFurnitureStore = create<FurnitureStore>((set) => ({
  furnitures: [],
  selectedFurnitureId: null,
  prevFurnitureStates: {},

  selectFurniture: (id) => set({ selectedFurnitureId: id }),
  clearSelection: () => set({ selectedFurnitureId: null }),

  addFurniture: (info) =>
    set((state) => ({
      furnitures: [...state.furnitures, info],
    })),

  updateFurniture: (id, updated) =>
    set((state) => {
      const current = state.furnitures.find((f) => f.id === id);
      if (!current) return {};

      return {
        prevFurnitureStates: {
          ...state.prevFurnitureStates,
          [id]: { ...current }, 
        },
        furnitures: state.furnitures.map((f) =>
          f.id === id ? { ...f, ...updated } : f,
        ),
      };
    }),

  removeFurniture: (id) =>
    set((state) => ({
      furnitures: state.furnitures.filter((f) => f.id !== id),
      prevFurnitureStates: {
        ...state.prevFurnitureStates,
        [id]: null,
      },
    })),

  setFurnitures: (items) => set({ furnitures: items }),

  undoFurniture: (id) =>
    set((state) => {
      const prev = state.prevFurnitureStates[id];
      if (!prev) return {};
      return {
        furnitures: state.furnitures.map((f) => (f.id === id ? prev : f)),
        prevFurnitureStates: {
          ...state.prevFurnitureStates,
          [id]: null, 
        },
      };
    }),
}));
