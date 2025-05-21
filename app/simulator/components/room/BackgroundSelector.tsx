'use client';

import { useEffect, useRef, useState } from 'react';

import { Backgrounds, useBackgroundStore } from '@/stores/useBackgroundStore';

export default function BackgroundSelector() {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentBackgroundId = useBackgroundStore(
    (state) => state.currentBackgroundId,
  );
  const setBackground = useBackgroundStore((state) => state.setBackground);
  const lastClickTimeRef = useRef<number>(0);

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

  // 컴포넌트 마운트 시 테마가 올바르게 로드되었는지 확인
  useEffect(() => {
    // 테마 스토어가 초기화되었는지 확인
    const initialBackground = useBackgroundStore.getState().currentBackgroundId;
    if (initialBackground !== currentBackgroundId) {
      setBackground(currentBackgroundId);
    }
  }, []);

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
        className={`flex items-center gap-2 ml-4 overflow-hidden ${isExpanded ? 'w-auto' : 'w-7'}`}
      >
        {isExpanded ? (
          // 모든 테마 옵션 보여주기
          Backgrounds.map((Background) => (
            <button
              key={Background.id}
              onClick={() => handleBackgroundSelect(Background.id)}
              className={`
                w-7 h-7 rounded-full 
                border-2 transition-all duration-200 flex-shrink-0
                ${
                  currentBackgroundId === Background.id
                    ? 'border-white'
                    : 'border-transparent hover:border-white/50'
                }
              `}
              title={Background.name}
              style={{ background: Background.dayBackground }}
            >
              <span className='sr-only'>{Background.name}</span>
            </button>
          ))
        ) : (
          // 현재 선택된 테마만 보여주기
          <div
            className='w-7 h-7 rounded-full border-2 border-white flex-shrink-0'
            style={{ background: currentBackground.dayBackground }}
            title={currentBackground.name}
          >
            <span className='sr-only'>{currentBackground.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}
