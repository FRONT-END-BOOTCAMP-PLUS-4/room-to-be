'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

import OnlyTextButton from './buttons/OnlyTextButton';

export default function MainHeader() {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className='absolute w-full h-[70px] z-10 flex items-center justify-between px-10'>
      <Link href='/' className='inline-block p-[10px]'>
        <Image
          src='/assets/icons/roomtobe-logo.svg'
          alt='roomtobe-logo'
          width={80}
          height={30}
        />
      </Link>
      {session.data ? (
        <div className='flex items-center gap-2'>
          {pathname !== '/rooms' && (
            <OnlyTextButton onClick={() => router.push('/rooms')}>
              My Rooms
            </OnlyTextButton>
          )}
          <OnlyTextButton onClick={() => signOut()}>Logout</OnlyTextButton>
        </div>
      ) : (
        <OnlyTextButton onClick={() => router.push('/login')}>
          Login
        </OnlyTextButton>
      )}
    </div>
  );
}
