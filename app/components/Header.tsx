import Image from 'next/image';
import Link from 'next/link';

import OnlyTextButton from './buttons/OnlyTextButton';

function Header() {
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
      <div className='flex items-center gap-2'>
        <OnlyTextButton>Login</OnlyTextButton>
        {/* <OnlyTextButton>MyPage</OnlyTextButton>
        <OnlyTextButton>Logout</OnlyTextButton> */}
      </div>
    </div>
  );
}
export default Header;
