import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 평수를 제곱미터로 변환하는 함수 (1평 = 약 3.3058㎡)
export const pyeongToSquareMeter = (pyeong: number): number => {
  return pyeong * 3.3058;
};

// 제곱미터를 평수로 변환하는 함수
export const squareMeterToPyeong = (squareMeter: number): number => {
  return squareMeter / 3.3058;
};

// 평수를 방의 가로, 세로 크기로 변환 (정사각형 가정)
export const pyeongToRoomDimensions = (
  pyeong: number,
): { width: number; height: number } => {
  const squareMeter = pyeongToSquareMeter(pyeong);
  const sideLength = Math.sqrt(squareMeter);

  return {
    width: Math.round(sideLength * 100) / 100,
    height: Math.round(sideLength * 100) / 100,
  };
};

interface RoomSize {
  mode: 'pyeong' | 'meter';
  pyeong: number;
  width: number;
  height: number;
  wallHeight: number;
  setPyeong: (value: number) => void;
  setDimensions: (width: number, height: number, wallHeight: number) => void;
  setMode: (mode: 'pyeong' | 'meter') => void;
}

export const useRoomSizeStore = create<RoomSize>()(
  persist(
    (set) => ({
      mode: 'pyeong',
      pyeong: 5,
      width: 4.07,
      height: 4.07,
      wallHeight: 2.5,

      setPyeong: (value: number) => {
        const { width, height } = pyeongToRoomDimensions(value);
        set({
          pyeong: value,
          width,
          height,
          mode: 'pyeong',
        });
      },

      setDimensions: (width: number, height: number, wallHeight: number) => {
        const area = width * height;
        const pyeong = squareMeterToPyeong(area);

        set({
          width,
          height,
          wallHeight: wallHeight || 2.5,
          pyeong: Math.round(pyeong * 100) / 100,
          mode: 'meter',
        });
      },

      setMode: (mode: 'pyeong' | 'meter') => set({ mode }),
    }),
    {
      name: 'room-size-storage',
      partialize: (state) => ({
        mode: state.mode,
        pyeong: state.pyeong,
        width: state.width,
        height: state.height,
        wallHeight: state.wallHeight,
      }),
    },
  ),
);
