import { create } from 'zustand';

import { FurnitureStoreInfo } from '@/app/types/furniture';

interface FurnitureStore {
  furnitures: FurnitureStoreInfo[];
  selectedFurnitureId: string | null;
  prevFurnitureStates: Record<string, FurnitureStoreInfo[]>;
  renderableFurnitureIds: string[];
  isCreating: boolean;

  selectFurniture: (id: string | null) => void;
  clearSelection: () => void;

  addFurniture: (info: FurnitureStoreInfo) => void;
  markRenderable: (id: string) => void;
  updateFurniture: (
    id: string,
    updated: Partial<FurnitureStoreInfo>,
    saveHistory?: boolean,
  ) => void;
  removeFurniture: (id: string) => void;

  setFurnitures: (items: FurnitureStoreInfo[]) => void;
  undoFurniture: (id: string) => void;
  clearFurnitures: () => void;
  setRenderableIds: (ids: string[]) => void;
  resetFurnitureHistory: (id: string) => void;
  setIsCreating: (value: boolean) => void;
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

  updateFurniture: (
    id: string,
    updated: Partial<FurnitureStoreInfo>,
    saveHistory: boolean = true,
  ) =>
    set((state) => {
      const current = state.furnitures.find((f) => f.id === id);
      if (!current) return {};

      const next = { ...current, ...updated };
      const prevStack = state.prevFurnitureStates[id] || [];

      const newStack = saveHistory
        ? [...prevStack, { ...current }].slice(-10)
        : prevStack;
      console.log('updateFurniture');
      console.log('current:', current);
      console.log('updated:', updated);
      console.log(
        'newStack:',
        newStack.map((s, i) => ({ i, posX: s.positionX, posZ: s.positionZ })),
      );
      return {
        prevFurnitureStates: {
          ...state.prevFurnitureStates,
          [id]: newStack,
        },
        furnitures: state.furnitures.map((f) => (f.id === id ? next : f)),
      };
    }),

  undoFurniture: (id) =>
    set((state) => {
      const stack = state.prevFurnitureStates[id];
      if (!stack || stack.length < 2) {
        console.warn('undo 불가', stack);
        return {};
      }

      const previous = stack[stack.length - 2];
      const updatedStack = stack.slice(0, -2);

      return {
        furnitures: state.furnitures.map((f) => (f.id === id ? previous : f)),
        prevFurnitureStates: {
          ...state.prevFurnitureStates,
          [id]: [...updatedStack, previous],
        },
      };
    }),

  removeFurniture: (id) =>
    set((state) => ({
      furnitures: state.furnitures.filter((f) => f.id !== id),
      prevFurnitureStates: {
        ...state.prevFurnitureStates,
        [id]: [],
      },
      renderableFurnitureIds: state.renderableFurnitureIds.filter(
        (rid) => rid !== id,
      ),
    })),

  setFurnitures: (items) => set({ furnitures: items }),

  clearFurnitures: () =>
    set({
      furnitures: [],
      renderableFurnitureIds: [],
      selectedFurnitureId: null,
    }),
  resetFurnitureHistory: (id: string) =>
    set((state) => ({
      prevFurnitureStates: {
        ...state.prevFurnitureStates,
        [id]: [],
      },
    })),
  setRenderableIds: (ids: string[]) => set({ renderableFurnitureIds: ids }),
}));
