import Image from 'next/image';

import Preview3DButton from './Preview3DButton';

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
};

export default function CarouselSlideItem({
  slide,
  idx,
  SLIDE_COUNT,
}: CarouselSlideItemProps) {
  console.log('서버 컴포넌트로 잘 됐나 확인');
  return (
    <div
      className={`
        flex-shrink-0 w-screen h-screen min-h-[670px]
        flex flex-col items-center justify-start gap-20
        md:flex-row md:items-center md:justify-center
        relative px-4 pt-12 pb-0 overflow-hidden md:px-20 md:pt-20
        ${slide.bg}
      `}
    >
      {/* 오른쪽 상단 큰 숫자 */}
      <span
        className='
          absolute right-4 top-8 md:right-12 md:top-16 text-[32px] sm:text-[44px] md:text-[72px] lg:text-[96px]
          font-extrabold text-white/30 select-none pointer-events-none
          leading-none z-20
        '
        style={{ lineHeight: '1' }}
      >
        {String(idx === 0 ? SLIDE_COUNT : idx > SLIDE_COUNT ? 1 : idx).padStart(
          2,
          '0',
        )}
      </span>

      {/* 텍스트/버튼 영역 */}
      <div
        className='
        relative z-10 flex flex-col gap-4 mb-4 w-[400px] md:-top-[60px]
        md:gap-8 md:max-w-2xl md:mb-0 md:mr-6
      '
      >
        <h2 className='text-white text-[2rem] sm:text-4xl md:text-6xl xl:text:8xl font-extrabold leading-[1.1] mb-1'>
          {slide.title}
        </h2>
        <p className='text-white/90 text-base sm:text-lg font-normal leading-snug mt-1 max-w-[90vw]'>
          {slide.desc}
        </p>
        <Preview3DButton href='/simulator'>
          3D 인테리어 미리보기
        </Preview3DButton>
      </div>
      {/* 3D 이미지 */}
      <div
        className={`
          relative w-full max-w-[300px] md:max-w-[400px] h-[180px]
          flex items-start top-[20px] 
          justify-center
          mt-auto mb-6 md:mb-0 md:mt-0
          md:w-[540px] md:h-[700px]
        `}
        style={{ minHeight: 180 }}
      >
        <Image
          src={slide.image2}
          alt='받침 이미지'
          width={540}
          height={260}
          className='
            absolute left-1/2 -translate-x-1/2 bottom-0 z-0 sm:bottom-[-82px] md:bottom-0 pointer-events-none select-none
          '
          style={{
            width: '100%',
            height: 'auto',
            maxWidth: '100%',
          }}
          draggable={false}
        />
        <Image
          src={slide.image}
          alt='3D 이미지'
          width={540}
          height={540}
          className='
            absolute left-1/2 -translate-x-1/2 bottom-[143px] sm:bottom-[60px] z-10 pointer-events-none select-none
            md:bottom-[189px]
            '
          style={{
            width: '100%',
            height: 'auto',
            maxWidth: '100%',
          }}
          draggable={false}
        />
      </div>
    </div>
  );
}
