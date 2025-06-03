'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import BoxTextButton from '../buttons/BoxTextButton';

type CarouselSlideItemProps = {
  slide: {
    title: string;
    desc: string;
    image: string;
    image2: string;
    bg: string;
  };
  idx: number;
  SLIDE_COUNT: number;
  onOpenModal?: () => void;
};

export default function CarouselSlideItem({
  slide,
  idx,
  SLIDE_COUNT,
  onOpenModal,
}: CarouselSlideItemProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`
        w-full h-screen relative overflow-hidden
        ${slide.bg}
      `}
    >
      {/* 텍스트 영역*/}
      <div
        className='absolute 
        left-1/2 -translate-x-1/2 top-[14%] 
        md:left-12 md:translate-x-0 md:top-[40%] md:-translate-y-1/2
        lg:left-10 lg:top-1/2 xl:left-14 2xl:left-32'
      >
        <div className='flex flex-col gap-6 2xl:gap-8 w-[280px] text-center items-center md:items-start md:text-left  md:w-[300px] lg:w-[420px] xl:w-[460px] 2xl:w-[580px]'>
          <h2
            className='text-white text-2xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold'
            style={{ lineHeight: '1.2' }}
          >
            {slide.title}
          </h2>
          <p className='text-white/90 text-sm lg:text-lg font-normal leading-relaxed mb-0 md:mb-2 lg:mb-4 2xl:mb-6'>
            {slide.desc}
          </p>
          <BoxTextButton
            showImg={true}
            className='w-[200px] h-[48px] text-[0.8rem] rounded-2xl lg:text-[0.9rem] lg:w-[216px] lg:h-[52px] 2xl:w-[268px] 2xl:h-[64px] 2xl:text-[1.1rem]'
            onClick={onOpenModal}
          >
            3D 인테리어 하러 가기
          </BoxTextButton>
        </div>
      </div>

      {/* 숫자 */}
      <div className='absolute top-[10%] md:top-auto md:bottom-[26rem] lg:bottom-[28rem] xl:bottom-[32rem] 2xl:bottom-[35rem] right-8 md:right-12 lg:right-10 xl:right-14 2xl:right-24 z-10'>
        <span
          className='
            text-[60px] md:text-[80px] lg:text-[90px] xl:text-[100px] 2xl:text-[140px]
            font-extrabold text-white/30 select-none pointer-events-none leading-none
          '
        >
          {String(
            idx === 0 ? SLIDE_COUNT : idx > SLIDE_COUNT ? 1 : idx,
          ).padStart(2, '0')}
        </span>
      </div>

      {/* 이미지 영역 */}
      <div
        className='absolute bottom-0 left-1/2 -translate-x-1/2
        md:left-auto md:translate-x-0 md:right-12 
        lg:right-10 xl:right-14 2xl:right-24'
      >
        <div className='relative w-[300px] md:w-[450px] lg:w-[500px] xl:w-[550px] 2xl:w-[600px] h-[200px] md:h-[250px] lg:h-[300px] xl:h-[350px] 2xl:h-[400px]'>
          {/* 받침 이미지 */}
          {slide?.image2 && (
            <Image
              src={slide.image2}
              alt='받침 이미지'
              width={830}
              height={400}
              className={`
                absolute bottom-[-6rem] left-1/2 -translate-x-1/2
                w-full h-auto
                md:bottom-[-8rem] lg:bottom-[-10rem] 2xl:bottom-[-12rem]
                ${isVisible ? 'animate-[slideUpFromBottom_1.2s_ease-out_0.3s_both]' : 'opacity-0 translate-y-[100px]'}
              `}
              style={{
                maxWidth: '100%',
                objectFit: 'contain',
              }}
              draggable={false}
            />
          )}

          {/* 메인 3D 이미지 */}
          <Image
            src={slide.image}
            alt='3D 이미지'
            width={720}
            height={720}
            className={`
              absolute bottom-14 md:bottom-24 lg:bottom-24 xl:bottom-28 2xl:bottom-38 left-1/2 -translate-x-1/2
              w-[85%] h-auto
              ${isVisible ? 'animate-[slideDownFromTop_1.4s_ease-out_0.1s_both]' : 'opacity-0 -translate-y-[100px]'}
            `}
            style={{
              maxWidth: '90%',
              objectFit: 'contain',
            }}
            draggable={false}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUpFromBottom {
          0% {
            transform: translate(-50%, 100px);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }

        @keyframes slideDownFromTop {
          0% {
            transform: translate(-50%, -100px);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
