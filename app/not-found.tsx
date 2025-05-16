import Link from 'next/link';
import OnlyTextButton from './components/buttons/OnlyTextButton';

export default function NotFound() {
  return (
    <div
      className='relative w-full min-h-screen bg-cover bg-center'
      style={{ backgroundImage: 'url(/assets/images/not-found.png)' }}
    >
      <div className='absolute top-1/3 left-1/2'>
        <Link href='/' passHref>
          <OnlyTextButton showImage className='font-light'>
            BACK TO HOME
          </OnlyTextButton>
        </Link>
      </div>
    </div>
  );
}
