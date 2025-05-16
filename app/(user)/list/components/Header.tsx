'use client';

import ProfileButton from '@/app/components/buttons/ProfileButton';
import BoxTextButton from '@/app/components/buttons/BoxTextButton';

export default function Header({ userImageUrl }: { userImageUrl: string }) {
  return (
    <div className='w-full h-[400px] text-white relative bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 bg-[length:200%_200%] animate-gradient-x px-8'>
      <div className='absolute top-[15px] left-0 w-full flex justify-between items-center px-8'>
        <div className='text-2xl font-bold'>ROOM TOBE</div>
        <div className='space-x-4'>
          <button className='text-sm'>MY PAGE</button>
          <button className='text-sm'>LOGOUT</button>
        </div>
      </div>

      <div className='absolute top-[90px] left-1/2 transform -translate-x-1/2 flex flex-col items-center'>
        <ProfileButton imageSrc={userImageUrl} />
        <div className='text-lg font-medium mt-2'>받아올겨</div>
      </div>

      <div className='absolute bottom-[120px] right-[40px]'>
        <BoxTextButton showImg={true} className='text-sm'>
          3D 인테리어하러가기
        </BoxTextButton>
      </div>
    </div>
  );
}
