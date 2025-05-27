'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import BoxTextButton from '@/app/components/buttons/BoxTextButton';
import ProfileButton from '@/app/components/buttons/ProfileButton';

import { getUserProfile } from '@/apis/users';

const DEFAULT_PROFILE_IMAGE = '/assets/icons/profile-rogo.svg';
export default function Header({ userId }: { userId: string }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState<string | null>(DEFAULT_PROFILE_IMAGE);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const user = await getUserProfile({ userId });
        setName(user.name);
        setImage(user.image ?? DEFAULT_PROFILE_IMAGE);
      } catch (err) {
        console.error('유저 정보 가져오기 실패:', err);
      }
    }

    fetchUserProfile();
  }, [userId]);

  return (
    <div
      className='w-full h-[400px] text-white relative 
  bg-gradient-to-r from-orange-300 via-pink-500 to-purple-500
  bg-[length:200%_200%] animate-gradient-x px-8 overflow-hidden'
    >
      <div className='absolute top-[15px] left-0 w-full flex justify-between items-center px-8'>
        <div className='text-2xl font-bold'>ROOM TOBE</div>
        <div className='space-x-4'>
          <button className='text-sm'>MY PAGE</button>
          <button className='text-sm'>LOGOUT</button>
        </div>
      </div>

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
