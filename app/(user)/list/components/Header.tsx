'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

import BoxTextButton from '@/app/components/buttons/BoxTextButton';
import ProfileButton from '@/app/components/buttons/ProfileButton';
import MainHeader from '@/app/components/MainHeader';

const DEFAULT_PROFILE_IMAGE = '/assets/icons/profile-rogo.svg';
export default function Header() {
  const { data } = useSession();
  const user = data?.user ?? { name: '', image: DEFAULT_PROFILE_IMAGE };
  const { name, image = DEFAULT_PROFILE_IMAGE } = user;

  return (
    <div
      className='w-full h-[400px] text-white relative 
  bg-gradient-to-r from-orange-300 via-pink-500 to-purple-500
  bg-[length:200%_200%] animate-gradient-x px-8 overflow-hidden'
    >
      <MainHeader />
      <div className='absolute top-[90px] left-1/2 transform -translate-x-1/2 flex flex-col items-center'>
        <ProfileButton imageSrc={image} />
        <div className='text-lg font-medium mt-2'>
          {name ? `${name}님` : ''}
        </div>
      </div>

      <div className='absolute bottom-[120px] right-[40px]'>
        <Link href='/simulator'>
          <BoxTextButton showImg={true} className='text-sm'>
            3D 인테리어하러가기
          </BoxTextButton>
        </Link>
      </div>
    </div>
  );
}
