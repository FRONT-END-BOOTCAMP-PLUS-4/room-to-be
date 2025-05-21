'use client';

import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';

import IconButton from '@/app/components/buttons/IconButton';
import Header from '@/app/components/Header';

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

  // 무한루프용 렌더 슬라이드
  const renderSlides = [slides[SLIDE_COUNT - 1], ...slides, slides[0]];

  const goTo = useCallback(
    (idx: number) => {
      if (isSliding) return;
      setIsSliding(true);
      setCurrent(idx);
      setTransition(true);
    },
    [isSliding],
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

  // transition이 꺼지면 바로 다시 켜서 자연스러운 무한루프 구현!
  useEffect(() => {
    if (!transition) {
      const id = requestAnimationFrame(() => setTransition(true));
      return () => cancelAnimationFrame(id);
    }
  }, [transition]);

  // 프로그레스 커스텀훅
  const { progress, setProgress } = useSliderProgress({
    playing,
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

  return (
    <div className='relative w-screen h-screen overflow-hidden shadow-2xl'>
      <Header />
      <div
        className={clsx(
          'flex h-full',
          transition ? 'transition-transform duration-700 ease-in-out' : '',
        )}
        style={{
          width: `calc(100vw * ${renderSlides.length})`,
          transform: `translateX(-${current * 100}vw)`,
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {renderSlides.map((jsx, idx) => (
          <div key={idx}>{jsx}</div>
        ))}
      </div>
      {/* Progress Bar & Play Button */}
      <div className='absolute left-4 md:left-12 bottom-4 mt-8 flex items-center gap-2 w-[85vw] max-w-xs z-30'>
        <Progress
          value={progress}
          className='
            w-full h-2
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
      />
      <IconButton
        height={46}
        width={30}
        imageSrc='/assets/icons/right.svg'
        className='absolute top-1/2 right-4'
        onClick={nextSlide}
      />
    </div>
  );
}
