import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CameraState {
  position: [number, number, number];
  setPosition: (pos: [number, number, number]) => void;
}

export const useCameraStore = create(
  persist<CameraState>(
    (set) => ({
      position: [5, 3, 5],
      setPosition: (pos) => set({ position: pos }),
    }),
    {
      name: 'camera-storage',
    },
  ),
);
