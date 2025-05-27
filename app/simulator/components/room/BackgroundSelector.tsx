'use client';

import { useEffect, useRef, useState } from 'react';

import { Backgrounds, useBackgroundStore } from '@/stores/useBackgroundStore';

// 색상 배열을 CSS 그라데이션으로 변환하는 함수
function createCSSGradient(colors: string[]): string {
  if (colors.length === 1) {
    return colors[0];
  }

  const colorStops = colors
    .map((color, index) => {
      const percentage = (index / (colors.length - 1)) * 100;
      return `${color} ${percentage}%`;
    })
    .join(', ');

  return `linear-gradient(180deg, ${colorStops})`;
}

export default function BackgroundSelector() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const currentBackgroundId = useBackgroundStore(
    (state) => state.currentBackgroundId,
  );
  const setBackground = useBackgroundStore((state) => state.setBackground);
  const hasHydrated = useBackgroundStore((state) => state.hasHydrated);
  const lastClickTimeRef = useRef<number>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 현재 선택된 테마 정보 가져오기
  const currentBackground =
    Backgrounds.find((Background) => Background.id === currentBackgroundId) ||
    Backgrounds[0];

  const handleBackgroundSelect = (BackgroundId: string) => {
    const now = Date.now();
    if (now - lastClickTimeRef.current < 300) {
      return;
    }
    lastClickTimeRef.current = now;

    setBackground(BackgroundId);
    setIsExpanded(false);
  };

  if (!mounted || !hasHydrated) {
    return (
      <div
        className={`
          px-[30px] py-[20px] rounded-[25px] 
          bg-gradient-to-r from-white/10 to-black/20 
          backdrop-blur-md shadow-[0_0_15px_#00000026] 
          flex items-center justify-between
          w-[219px]
        `}
      >
        <button
          className={`
            py-[7px] h-7 bg-white/30 rounded-md
            hover:bg-white/40 transition-colors duration-300 ease-in-out 
            flex justify-center items-center select-none flex-grow
          `}
        >
          <span className='text-[12px] text-white'>배경 선택</span>
        </button>
        <div className='flex items-center gap-2 ml-4 w-7'>
          <div
            className='w-6 h-6 rounded-full border-3 border-transparent ring-2 ring-white flex-shrink-0'
            style={{
              background: createCSSGradient(Backgrounds[0].dayBackground),
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        px-[30px] py-[20px] rounded-[25px] 
        bg-gradient-to-r from-white/10 to-black/20 
        backdrop-blur-md shadow-[0_0_15px_#00000026] 
        flex items-center justify-between
        transition-all duration-300 ease-in-out
        ${isExpanded ? 'w-auto min-w-[300px]' : 'w-[219px]'}
      `}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          py-[7px] h-7 bg-white/30 rounded-md
          hover:bg-white/40 transition-colors duration-300 ease-in-out 
          flex justify-center items-center select-none
          ${isExpanded ? 'min-w-[100px]' : 'flex-grow'}
        `}
      >
        <span className='text-[12px] text-white'>배경 선택</span>
      </button>

      {/* 테마 선택 옵션들 */}
      <div
        className={`flex items-center gap-2 ml-4 ${isExpanded ? 'w-auto' : 'w-7'}`}
      >
        {isExpanded ? (
          // 모든 테마 옵션 보여주기
          Backgrounds.map((Background) => (
            <button
              key={Background.id}
              onClick={() => handleBackgroundSelect(Background.id)}
              className={`
                w-6 h-6 rounded-full 
                border-3 transition-all duration-200 flex-shrink-0
                ${
                  currentBackgroundId === Background.id
                    ? 'ring-2 ring-white'
                    : 'hover:ring-2 hover:ring-white/50'
                }
              `}
              title={Background.name}
              style={{
                background: createCSSGradient(Background.dayBackground),
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <span className='sr-only'>{Background.name}</span>
            </button>
          ))
        ) : (
          // 현재 선택된 테마만 보여주기
          <div
            className='w-6 h-6 rounded-full border-3 border-transparent ring-2 ring-white flex-shrink-0'
            style={{
              background: createCSSGradient(currentBackground.dayBackground),
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
            }}
            title={currentBackground.name}
          >
            <span className='sr-only'>{currentBackground.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}
