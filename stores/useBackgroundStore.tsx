import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface Background {
  id: string;
  name: string;
  dayBackground: string[];
  nightBackground: string[];
  dayLightColor: string;
  dayLightIntensity: number;
  nightLightColor: string;
  nightLightIntensity: number;
}

function darkenColor(hex: string, factor: number = 0.7): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const newR = Math.round(r * factor);
  const newG = Math.round(g * factor);
  const newB = Math.round(b * factor);

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

export const Backgrounds: Background[] = [
  {
    id: 'beige',
    name: '베이지',
    dayBackground: ['#C8944C', '#AB722F'],
    nightBackground: ['#C8944C', '#AB722F'].map((color) =>
      darkenColor(color, 0.5),
    ),
    dayLightColor: '#fff8e7',
    dayLightIntensity: 1.2,
    nightLightColor: '#ffd89b',
    nightLightIntensity: 0.8,
  },
  {
    id: 'nature',
    name: '네이처',
    dayBackground: ['#3C4A30', '#57623F', '#8A8853'],
    nightBackground: ['#3C4A30', '#57623F', '#8A8853'].map((color) =>
      darkenColor(color, 0.3),
    ),
    dayLightColor: '#e8f0fe',
    dayLightIntensity: 0.9,
    nightLightColor: '#00d4aa',
    nightLightIntensity: 1.2,
  },
  {
    id: 'cyber',
    name: '사이버 톤',
    dayBackground: ['#081F19', '#0A2E27'],
    nightBackground: ['#081F19', '#0A2E27'].map((color) =>
      darkenColor(color, 0.4),
    ),
    dayLightColor: '#e1f5fe',
    dayLightIntensity: 1.1,
    nightLightColor: '#81c784',
    nightLightIntensity: 0.7,
  },
  {
    id: 'midnight',
    name: '미드나잇',
    dayBackground: ['#101B1F', '#203036'],
    nightBackground: ['#101B1F', '#203036'].map((color) =>
      darkenColor(color, 0.5),
    ),
    dayLightColor: '#fce4ec',
    dayLightIntensity: 1.0,
    nightLightColor: '#ce93d8',
    nightLightIntensity: 0.8,
  },
  {
    id: 'dark',
    name: '다크',
    dayBackground: ['#141514', '#23221D'],
    nightBackground: ['#141514', '#23221D'].map((color) =>
      darkenColor(color, 0.5),
    ),
    dayLightColor: '#f1f8e9',
    dayLightIntensity: 1.0,
    nightLightColor: '#c8e6c9',
    nightLightIntensity: 0.8,
  },
  {
    id: 'purple',
    name: '퍼플 톤',
    dayBackground: ['#1E052B', '#461745', '#722BA5'],
    nightBackground: ['#1E052B', '#461745', '#722BA5'].map((color) =>
      darkenColor(color, 0.3),
    ),
    dayLightColor: '#e8f4fd',
    dayLightIntensity: 1.0,
    nightLightColor: '#a8c8ec',
    nightLightIntensity: 0.6,
  },
];

interface BackgroundStore {
  currentBackgroundId: string;
  hasHydrated: boolean;
  setBackground: (BackgroundId: string) => void;
  getCurrentBackground: () => Background;
  setHasHydrated: (hasHydrated: boolean) => void;
}

// 상태를 로컬 스토리지에 저장하도록 persist 미들웨어 추가
export const useBackgroundStore = create<BackgroundStore>()(
  persist(
    (set, get) => ({
      currentBackgroundId: 'beige',
      hasHydrated: false,
      setBackground: (id: string) => {
        const backgroundExists = Backgrounds.find((bg) => bg.id === id);
        if (backgroundExists) {
          set({ currentBackgroundId: id });
        }
      },
      getCurrentBackground: () => {
        const { currentBackgroundId } = get();
        return (
          Backgrounds.find((bg) => bg.id === currentBackgroundId) ||
          Backgrounds[0]
        );
      },

      setHasHydrated: (hasHydrated: boolean) => {
        set({ hasHydrated });
      },
    }),
    {
      name: 'Background-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentBackgroundId: state.currentBackgroundId,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    },
  ),
);
