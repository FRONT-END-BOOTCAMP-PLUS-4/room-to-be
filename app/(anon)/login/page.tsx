'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

import IconButton from '@/app/components/buttons/IconButton';

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  // 로그인 되었으면 홈으로 이동
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/'); // replace로 history에 남기지 않음
    }
  }, [status, router]);

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br gradient-01 relative'>
      <IconButton
        onClick={() => router.push('/')}
        imageSrc='/assets/icons/cross.svg'
        width={25}
        height={25}
        className='absolute top-5 right-5 md:top-9 md:right-9 z-20 opacity-70 hover:opacity-100 active:scale-95'
      />
      <div className='flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-2xl px-12 py-14 shadow-lg min-w-[380px]'>
        <h2 className="text-center text-white text-3xl font-bold mb-6 font-['Inter']">
          Welcome RoomToBe
        </h2>
        <span className="text-center text-white text-base font-semibold mb-8 font-['Inter']">
          SNS 계정으로 로그인
        </span>
        <div className='flex flex-col gap-4 w-72'>
          {/* Google Login */}
          <button
            className='flex items-center gap-3 px-6 py-3 border border-white rounded-xl bg-white/10 hover:bg-white/20 transition text-white font-medium'
            type='button'
            onClick={() => signIn('google')}
          >
            <span className='bg-white text-[#EA4335] rounded-full w-7 h-7 flex items-center justify-center font-extrabold text-xl'>
              G
            </span>
            <span className='flex-1 text-center'>구글로 로그인 하기</span>
          </button>
          {/* Kakao Login */}
          <button
            className='flex items-center gap-3 px-6 py-3 border border-[#FEE500] rounded-xl bg-[#FEE500] hover:bg-[#e6c800] transition text-[#3C1E1E] font-medium'
            type='button'
            onClick={() => signIn('kakao')}
          >
            <span className='bg-white rounded-full w-7 h-7 flex items-center justify-center'>
              <Image
                width={15}
                height={15}
                src='/assets/icons/kakao.png'
                alt='Kakao Logo'
              />
            </span>
            <span className='flex-1 text-center'>카카오톡으로 로그인 하기</span>
          </button>
          {/* Naver Login */}
          <button
            className='flex items-center gap-3 px-6 py-3 border border-[#03C75A] rounded-xl bg-[#03C75A] hover:bg-[#02b152] transition text-white font-medium'
            type='button'
            onClick={() => signIn('naver')}
          >
            <span className='bg-white rounded w-7 h-7 flex items-center justify-center'>
              <span className='text-[#03C75A] font-extrabold text-lg'>N</span>
            </span>
            <span className='flex-1 text-center'>네이버로 로그인 하기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
