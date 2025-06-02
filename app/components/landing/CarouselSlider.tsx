'use client';

import { useCallback, useEffect, useState } from 'react';
import React from 'react';
import clsx from 'clsx';

import IconButton from '@/app/components/buttons/IconButton';
import MainHeader from '@/app/components/MainHeader';
import ModalController from '@/app/components/modal/ModalController';

import { Progress } from '@/components/ui/progress';

import { useSliderProgress } from '@/hooks/useSliderProgress';

type CarouselSliderProps = {
  slides: React.ReactNode[];
};

const AUTO_PLAY_INTERVAL = 6000;

export default function CarouselSlider({ slides }: CarouselSliderProps) {
  const SLIDE_COUNT = slides.length;
  const [current, setCurrent] = useState(1);
  const [transition, setTransition] = useState(true);
  const [isSliding, setIsSliding] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [isResizing, setIsResizing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 무한루프용 렌더 슬라이드
  const renderSlides = [slides[SLIDE_COUNT - 1], ...slides, slides[0]];

  const goTo = useCallback(
    (idx: number) => {
      if (isSliding || isResizing) return;
      setIsSliding(true);
      setCurrent(idx);
      setTransition(true);
    },
    [isSliding, isResizing],
  );
  const nextSlide = useCallback(() => goTo(current + 1), [current, goTo]);
  const prevSlide = useCallback(() => goTo(current - 1), [current, goTo]);

  const handleTransitionEnd = () => {
    setIsSliding(false);
    if (current === SLIDE_COUNT + 1) {
      setTransition(false);
      setCurrent(1);
    } else if (current === 0) {
      setTransition(false);
      setCurrent(SLIDE_COUNT);
    }
  };

  // resize 이벤트 핸들러
  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;

    const handleResize = () => {
      setIsResizing(true);
      setTransition(false);

      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setIsResizing(false);
        setTimeout(() => {
          setTransition(true);
        }, 50);
      }, 300);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // transition이 꺼지면 바로 다시 켜서 자연스러운 무한루프 구현!
  useEffect(() => {
    if (!transition && !isResizing) {
      const id = requestAnimationFrame(() => setTransition(true));
      return () => cancelAnimationFrame(id);
    }
  }, [transition, isResizing]);

  // 프로그레스 커스텀훅
  const { progress, setProgress } = useSliderProgress({
    playing: playing && !isResizing,
    autoPlayInterval: AUTO_PLAY_INTERVAL,
    onComplete: () => {
      setTimeout(() => {
        setCurrent((prev) => prev + 1);
        setTransition(true);
        setIsSliding(true);
        setProgress(0);
      }, 10);
    },
    deps: [current],
  });

  const handlePlayToggle = () => setPlaying((prev) => !prev);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <div className='relative w-screen h-screen overflow-hidden shadow-2xl'>
        <MainHeader />
        <div
          className={clsx(
            'flex h-full',
            transition && !isResizing
              ? 'transition-transform duration-700 ease-in-out'
              : '',
          )}
          style={{
            width: `calc(100vw * ${renderSlides.length})`,
            transform: `translateX(-${current * 100}vw)`,
            willChange: isResizing ? 'auto' : 'transform',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {renderSlides.map((jsx, idx) => {
            // 실제 슬라이드 인덱스 계산 (무한루프 고려)
            let slideIndex = idx - 1;
            if (slideIndex < 0) slideIndex = SLIDE_COUNT - 1;
            if (slideIndex >= SLIDE_COUNT) slideIndex = 0;

            // 배경 클래스명들
            const bgClasses = [
              'gradient-01',
              'gradient-02',
              'gradient-03',
              'gradient-04',
            ];

            const slideElement = React.cloneElement(jsx as React.ReactElement, {
              onOpenModal: handleOpenModal,
            });

            return (
              <div
                key={`${current}-${idx}`}
                className={`
                w-screen h-full 
                px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-32
                box-border
                ${bgClasses[slideIndex] || 'gradient-01'}
              `}
              >
                {slideElement}
              </div>
            );
          })}
        </div>

        {/* Progress Bar & Play Button */}
        <div className='absolute left-6 md:left-24 bottom-6 mt-8 flex items-center gap-2 w-[85vw] max-w-xs z-30'>
          <Progress
            value={progress}
            className='
            w-full h-1
            bg-white/30
            rounded-full
            overflow-hidden
            [&>div]:bg-white
            [&>div]:rounded-full
          '
          />
          <button
            onClick={handlePlayToggle}
            className='ml-3 w-6 h-6 flex items-center justify-center transition'
            aria-label={playing ? '정지' : '재생'}
            tabIndex={0}
          >
            {playing ? (
              <img
                src='/assets/icons/pause.svg'
                alt='pause'
                width={18}
                height={18}
              />
            ) : (
              <svg width='18' height='18' fill='none' viewBox='0 0 24 24'>
                <polygon points='7,6 19,12 7,18' fill='#fff' />
              </svg>
            )}
          </button>
        </div>

        {/* 좌우 버튼 */}
        <IconButton
          height={46}
          width={30}
          imageSrc='/assets/icons/left.svg'
          className='absolute top-1/2 left-4'
          onClick={prevSlide}
          disabled={isResizing}
        />
        <IconButton
          height={46}
          width={30}
          imageSrc='/assets/icons/right.svg'
          className='absolute top-1/2 right-4'
          onClick={nextSlide}
          disabled={isResizing}
        />
      </div>

      {isModalOpen && (
        <div className='z-[9999]'>
          <ModalController onClose={handleCloseModal} />
        </div>
      )}
    </>
  );
}
