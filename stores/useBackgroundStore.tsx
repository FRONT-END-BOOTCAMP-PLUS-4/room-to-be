import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Background {
  id: string;
  name: string;
  dayBackground: string;
  nightBackground: string;
  dayLightColor: string;
  dayLightIntensity: number;
  nightLightColor: string;
  nightLightIntensity: number;
}

export const Backgrounds: Background[] = [
  {
    id: 'beige',
    name: '베이지',
    dayBackground: '#d9b675',
    nightBackground: '#5c4b2d',
    dayLightColor: '#ffe9b8',
    dayLightIntensity: 1.1,
    nightLightColor: '#ffcc7a',
    nightLightIntensity: 1.5,
  },
  {
    id: 'nature',
    name: '네이처',
    dayBackground: '#4b6445',
    nightBackground: '#263523',
    dayLightColor: '#e1f0d1',
    dayLightIntensity: 1.1,
    nightLightColor: '#c5d8ae',
    nightLightIntensity: 1.5,
  },
  {
    id: 'minimal',
    name: '미니멀',
    dayBackground: '#777777',
    nightBackground: '#2d2d2d',
    dayLightColor: '#ffffff',
    dayLightIntensity: 1.2,
    nightLightColor: '#d6d6d6',
    nightLightIntensity: 1.5,
  },
  {
    id: 'midnight',
    name: '미드나잇',
    dayBackground: '#1c3047',
    nightBackground: '#0a141e',
    dayLightColor: '#a7c8ff',
    dayLightIntensity: 1.0,
    nightLightColor: '#9e9e9e',
    nightLightIntensity: 2,
  },
  {
    id: 'violet',
    name: '바이올렛',
    dayBackground: '#803367',
    nightBackground: '#551D50',
    dayLightColor: '#f4eaff',
    dayLightIntensity: 1.0,
    nightLightColor: '#e2b8ff',
    nightLightIntensity: 1.5,
  },
  {
    id: 'night',
    name: '다크',
    dayBackground: '#25262a',
    nightBackground: '#121215',
    dayLightColor: '#e2e2e2',
    dayLightIntensity: 0.9,
    nightLightColor: '#9e9e9e',
    nightLightIntensity: 2,
  },
];

interface BackgroundStore {
  currentBackgroundId: string;
  setBackground: (BackgroundId: string) => void;
  getCurrentBackground: () => Background;
}

// 상태를 로컬 스토리지에 저장하도록 persist 미들웨어 추가
export const useBackgroundStore = create<BackgroundStore>()(
  persist(
    (set, get) => ({
      currentBackgroundId: 'warm',
      setBackground: (BackgroundId) => {
        const validBackground = Backgrounds.find(
          (Background) => Background.id === BackgroundId,
        );
        if (validBackground) {
          set({ currentBackgroundId: BackgroundId });
        }
      },
      getCurrentBackground: () => {
        const { currentBackgroundId } = get();
        return (
          Backgrounds.find(
            (Background) => Background.id === currentBackgroundId,
          ) || Backgrounds[0]
        );
      },
    }),
    {
      name: 'Background-storage',
      partialize: (state) => ({
        currentBackgroundId: state.currentBackgroundId,
      }),
    },
  ),
);
