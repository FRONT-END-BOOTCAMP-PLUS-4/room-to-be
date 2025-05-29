import { create } from 'zustand';

interface CameraState {
  position: [number, number, number];
  setPosition: (pos: [number, number, number]) => void;
}

export const useCameraStore = create<CameraState>((set) => ({
  position: [0, 0, 0],
  setPosition: (pos) => set({ position: pos }),
}));
