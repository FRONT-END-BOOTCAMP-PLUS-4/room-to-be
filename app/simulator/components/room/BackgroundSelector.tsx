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
  const [showOptions, setShowOptions] = useState(false); // 내부 옵션 fade-out DOM 제거
  const [mounted, setMounted] = useState(false);
  const currentBackgroundId = useBackgroundStore(
    (state) => state.currentBackgroundId,
  );
  const setBackground = useBackgroundStore((state) => state.setBackground);
  const hasHydrated = useBackgroundStore((state) => state.hasHydrated);
  const lastClickTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 옵션 fade 제어
  useEffect(() => {
    if (isExpanded) {
      setShowOptions(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    } else {
      // 닫힐 때 옵션 DOM 제거를 0.5초 뒤로 미룸 (트랜지션 맞춤)
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowOptions(false);
      }, 400);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isExpanded]);

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
        px-[25px] py-[10px] rounded-[15px]
        bg-gradient-to-r from-white/10 to-black/20 
        backdrop-blur-md shadow-[0_0_15px_#00000026]
        flex items-center
        transition-[max-width] duration-400 ease-in-out
        overflow-hidden
      `}
      style={{
        maxWidth: isExpanded ? 500 : 219,
        transition: 'max-width 0.4s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      {/* 항상 width 고정! */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          w-full py-[7px] h-7 bg-white/30 rounded-md
          hover:bg-white/40 transition-colors duration-300 ease-in-out 
          flex justify-center items-center select-none
        `}
      >
        <span className='px-[20px] text-white text-[12px]'>배경 선택</span>
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

        {/* 옵션이 있을 때만 opacity로 부드럽게 */}
        {(showOptions || isExpanded) && (
          <div
            className={`
              flex items-center gap-2 ml-2
              transition-opacity duration-400
              ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            `}
            style={{
              minWidth: isExpanded ? 0 : undefined, // 가로 공간 보존
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
        )}
      </div>
    </div>
  );
}
