import { create } from 'zustand';

import { FurnitureStoreInfo } from '@/app/types/furniture';

interface FurnitureStore {
  furnitures: FurnitureStoreInfo[];
  selectedFurnitureId: string | null;
  prevFurnitureStates: Record<string, FurnitureStoreInfo | null>;
  renderableFurnitureIds: string[];
  isCreating: boolean;

  selectFurniture: (id: string | null) => void;
  clearSelection: () => void;

  addFurniture: (info: FurnitureStoreInfo) => void;
  markRenderable: (id: string) => void;
  updateFurniture: (id: string, updated: Partial<FurnitureStoreInfo>) => void;
  removeFurniture: (id: string) => void;

  setFurnitures: (items: FurnitureStoreInfo[]) => void;
  undoFurniture: (id: string) => void;
  clearFurnitures: () => void;
  setRenderableIds: (ids: string[]) => void;

  setIsCreating: (value: boolean) => void;
  updateBaseSize: (id: string, size: { baseX: number; baseZ: number }) => void;
}

export const useFurnitureStore = create<FurnitureStore>((set) => ({
  furnitures: [],
  selectedFurnitureId: null,
  prevFurnitureStates: {},
  renderableFurnitureIds: [],
  isCreating: false,

  setIsCreating: (value) => set({ isCreating: value }),

  selectFurniture: (id: string | null) => set({ selectedFurnitureId: id }),

  clearSelection: () => set({ selectedFurnitureId: null }),

  addFurniture: (info) =>
    set((state) => ({
      furnitures: [...state.furnitures, info],
    })),

  markRenderable: (id) =>
    set((state) => ({
      renderableFurnitureIds: [...state.renderableFurnitureIds, id],
    })),

  updateFurniture: (id, updated) =>
    set((state) => {
      const current = state.furnitures.find((f) => f.id === id);
      if (!current) return {};

      const alreadySaved = state.prevFurnitureStates[id];

      return {
        prevFurnitureStates: {
          ...state.prevFurnitureStates,
          [id]: alreadySaved ?? { ...current },
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
      renderableFurnitureIds: state.renderableFurnitureIds.filter(
        (rid) => rid !== id,
      ),
    })),

  setFurnitures: (items) => set({ furnitures: items }),

  updateBaseSize: (id: string, size: { baseX: number; baseZ: number }) =>
    set((state) => ({
      furnitures: state.furnitures.map((f) =>
        f.id === id ? { ...f, baseX: size.baseX, baseZ: size.baseZ } : f,
      ),
    })),

  clearFurnitures: () =>
    set({
      furnitures: [],
      renderableFurnitureIds: [],
      selectedFurnitureId: null,
    }),

  setRenderableIds: (ids: string[]) => set({ renderableFurnitureIds: ids }),

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
