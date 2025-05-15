import Image from 'next/image';
import BoxTextButton from '../buttons/BoxTextButton';
import IconButton from '../buttons/IconButton';

function Landing01() {
  return (
    <div className=' h-screen bg-gradient-to-b from-amber-800 to-orange-400 overflow-hidden'>
      <div className='absolute inset-0 flex items-center justify-center px-[120px] overflow-hidden'>
        {/* 좌측 텍스트 영역 */}
        <div className='flex flex-col gap-10 z-10'>
          <h1 className='text-white text-[48px] xl:text-[64px] font-extrabold leading-[50px] lx:leading-[80px]'>
            Draw the Space,
            <br />
            Fill the Home
          </h1>
          <p className='text-white text-base xl:text-lg font-normal leading-relaxed'>
            RoomToBe lets you design your future room in 3D <br />— drag, drop,
            and plan your space before you move in.
          </p>
          <BoxTextButton showImg={true} className='w-[230px]'>
            3D 인테리어 하러가기
          </BoxTextButton>
        </div>

        {/* 우측 3D 이미지 */}
        <div className='relative top-20 w-[600px] h-[600px]'>
          <Image
            priority
            src='/assets/images/main-room-ocher.png'
            alt='3D Room'
            fill
            className='object-contain'
          />
        </div>
      </div>
      {/* 상단 숫자 */}
      <div className='absolute top-[80px] right-[120px] text-white/30 text-[120px] font-extrabold z-0'>
        01
      </div>

      {/* 좌우 화살표 버튼 */}

      <IconButton
        width={25}
        height={45}
        imageSrc='assets/icons/left.svg'
        className='absolute left-[40px] top-1/2 -translate-y-1/2 z-20'
      />
      <IconButton
        width={25}
        height={45}
        imageSrc='assets/icons/right.svg'
        className='absolute right-[40px] top-1/2 -translate-y-1/2 z-20'
      />
    </div>
  );
}

export default Landing01;
