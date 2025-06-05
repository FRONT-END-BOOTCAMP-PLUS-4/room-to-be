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

  // 로딩 전 스켈레톤
  if (!mounted || !hasHydrated) {
    return (
      <div
        className={`
          px-[30px] py-[10px] rounded-[15px] 
          bg-gradient-to-r from-white/10 to-black/20 
          backdrop-blur-md shadow-[0_0_15px_#00000026] 
          flex items-center justify-between
          w-[219px]
        `}
      >
        <button
          className={`
            py-[7px] h-7 min-w-[100px] w-auto bg-white/30 rounded-md
            hover:bg-white/40 transition-colors duration-300 ease-in-out text-[12px]
            flex justify-center items-center select-none
          `}
        >
          <span className='px-[16px] text-white'>배경 선택</span>
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

  // 실질적인 선택 UI
  return (
    <div
      className={`
        px-[20px] py-[10px] rounded-[15px]
        bg-gradient-to-r from-white/10 to-black/20 
        backdrop-blur-md shadow-[0_0_15px_#00000026]
        flex items-center
        transition-all duration-300 ease-in-out
        overflow-hidden
      `}
      style={{
        width: isExpanded ? 305 : 168,
      }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          py-[7px] h-7 min-w-[90px] max-w-[90px] bg-white/30 rounded-md
          hover:bg-white/40 transition-colors duration-300 ease-in-out 
          flex justify-center items-center select-none text-[12px]
        `}
      >
        <span className='text-white whitespace-nowrap'>배경 선택</span>
      </button>

      {/* 항상 선택된 컬러는 왼쪽에 고정! */}
      <div className='flex items-center ml-4'>
        <div
          className='w-5 h-5 rounded-full border-3 border-transparent ring-2 ring-white flex-shrink-0'
          style={{
            background: createCSSGradient(currentBackground.dayBackground),
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
          }}
          title={currentBackground.name}
        >
          <span className='sr-only'>{currentBackground.name}</span>
        </div>

        <div
          className={`
            flex items-center gap-2 ml-2
            transition-all duration-300 ease-in-out
          `}
          style={{
            opacity: isExpanded ? 1 : 0,
            transform: isExpanded ? 'translateX(0)' : 'translateX(-20px)',
            visibility: isExpanded ? 'visible' : 'hidden',
          }}
        >
          {Backgrounds.filter((bg) => bg.id !== currentBackgroundId).map(
            (Background) => (
              <button
                key={Background.id}
                onClick={() => handleBackgroundSelect(Background.id)}
                className={`
                  w-5 h-5 rounded-full 
                  border-3 transition-all duration-200 flex-shrink-0
                  hover:ring-2 hover:ring-white/50
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
            ),
          )}
        </div>
      </div>
    </div>
  );
}
