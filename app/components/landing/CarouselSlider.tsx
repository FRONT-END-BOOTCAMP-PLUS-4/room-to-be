'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import React from 'react';
import clsx from 'clsx';

import IconButton from '@/app/components/buttons/IconButton';
import MainHeader from '@/app/components/MainHeader';
import ModalController from '@/app/components/modal/ModalController';

import { Progress } from '@/components/ui/progress';

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
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const [slideDirection, setSlideDirection] = useState<
    'left' | 'right' | 'none'
  >('none');
  const previousCurrentRef = useRef(current);

  const [progress, setProgress] = useState(0);
  const animationIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);

  // 무한루프용 렌더 슬라이드
  const renderSlides = [slides[SLIDE_COUNT - 1], ...slides, slides[0]];

  const goTo = useCallback(
    (idx: number) => {
      if (isSliding || isResizing) return;
      if (isFirstLoad) setIsFirstLoad(false);

      // 방향 감지
      const prevCurrent = previousCurrentRef.current;
      let direction: 'left' | 'right' | 'none' = 'none';

      if (idx > prevCurrent) {
        direction = 'right';
      } else if (idx < prevCurrent) {
        direction = 'left';
      }

      // 무한루프 경계에서의 방향 처리
      if (prevCurrent === 1 && idx === SLIDE_COUNT + 1) {
        direction = 'right';
      } else if (prevCurrent === SLIDE_COUNT && idx === 0) {
        direction = 'left';
      }

      setSlideDirection(direction);
      previousCurrentRef.current = idx;

      setIsSliding(true);
      setCurrent(idx);
      setTransition(true);

      setProgress(0);
      startTimeRef.current = null;
      pausedTimeRef.current = 0;
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
    },
    [isSliding, isResizing, SLIDE_COUNT, isFirstLoad],
  );

  const nextSlide = useCallback(() => goTo(current + 1), [current, goTo]);
  const prevSlide = useCallback(() => goTo(current - 1), [current, goTo]);

  const handleTransitionEnd = () => {
    setIsSliding(false);
    if (current === SLIDE_COUNT + 1) {
      setTransition(false);
      setCurrent(1);
      previousCurrentRef.current = 1;
    } else if (current === 0) {
      setTransition(false);
      setCurrent(SLIDE_COUNT);
      previousCurrentRef.current = SLIDE_COUNT;
    }

    setTimeout(() => {
      setSlideDirection('none');
    }, 100);
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

  // 프로그레스바 애니메이션
  useEffect(() => {
    if (!playing || isSliding) {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
      return;
    }

    // 애니메이션 시작/재개
    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed =
        currentTime - startTimeRef.current + pausedTimeRef.current;
      const newProgress = Math.min((elapsed / AUTO_PLAY_INTERVAL) * 100, 100);

      setProgress(newProgress);

      if (newProgress >= 100) {
        // 자동 슬라이드 변경
        setSlideDirection('right');
        previousCurrentRef.current = current;
        setCurrent((prev) => prev + 1);
        setTransition(true);
        setIsSliding(true);

        // 프로그레스 리셋 (자동 변경시)
        setProgress(0);
        startTimeRef.current = null;
        pausedTimeRef.current = 0;
        return;
      }

      // 계속 진행 (리사이즈 중에도 진행)
      if (playing && !isSliding) {
        animationIdRef.current = requestAnimationFrame(animate);
      }
    };

    animationIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
    };
  }, [playing, isSliding, current]);

  const handlePlayToggle = () => {
    if (playing) {
      // 정지: 현재까지의 진행시간 저장
      if (startTimeRef.current) {
        pausedTimeRef.current += performance.now() - startTimeRef.current;
      }
      startTimeRef.current = null;

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
    } else {
      // 재생: startTime 리셋 (pausedTime은 유지)
      startTimeRef.current = null;
    }

    setPlaying(!playing);
  };

  // 컴포넌트 언마운트 시 클린업
  useEffect(() => {
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

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

            const isActiveSlide = idx === current;

            // 배경 클래스명들
            const bgClasses = [
              'gradient-01',
              'gradient-02',
              'gradient-03',
              'gradient-04',
            ];

            const slideElement = React.cloneElement(jsx as React.ReactElement, {
              onOpenModal: handleOpenModal,
              slideDirection: isActiveSlide ? slideDirection : 'none',
              isActive: isActiveSlide,
              isFirstLoad: isFirstLoad && isActiveSlide,
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
        <div className='absolute bottom-6 2xl:bottom-8 flex items-center gap-2 w-[60vw] max-w-[280px] lg:max-w-[300px] xl:-max-w-[320px] 2xl:w-[85vw] 2xl:max-w-[340px] z-30 left-1/2 -translate-x-1/2 md:left-16 md:translate-x-0 xl:left-24 2xl:left-32'>
          <Progress
            value={progress}
            className='
            w-full h-1
            bg-white/30
            rounded-full
            overflow-hidden
            [&>div]:bg-white
            [&>div]:rounded-full
            &>div]:transition-all
            [&>div]:duration-100
            [&>div]:ease-linear
          '
          />
          <button
            onClick={handlePlayToggle}
            className='ml-3 w-5 h-5 2xl:w-6 2xl:h-6 flex items-center justify-center transition'
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
          height={42}
          width={26}
          imageSrc='/assets/icons/left.svg'
          className='absolute top-1/2 left-4 md:left-6 xl:left-8 2xl:left-12'
          onClick={prevSlide}
          disabled={isResizing}
        />
        <IconButton
          height={42}
          width={26}
          imageSrc='/assets/icons/right.svg'
          className='absolute top-1/2 right-4 md:right-6 xl:right-8 2xl:right-12'
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
