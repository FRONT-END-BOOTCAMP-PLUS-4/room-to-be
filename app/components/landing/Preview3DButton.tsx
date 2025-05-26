'use client';

import { ButtonHTMLAttributes } from 'react';
import { useRouter } from 'next/navigation';

import { useLoading } from '@/app/hooks/useLoading';

import BoxTextButton from '../buttons/BoxTextButton';

type Preview3DButtonProps = {
  href: string;
  children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Preview3DButton({
  href,
  children,
  ...props
}: Preview3DButtonProps) {
  const router = useRouter();
  const { loading } = useLoading();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    loading(
      async () => {
        router.push(href);
      },
      '3D 공간을 준비하고 있습니다...',
      1500,
    );

    if (props.onClick) props.onClick(e);
  };

  return (
    <BoxTextButton
      showImg={true}
      className='w-[240px] sm:w-[236px] mt-2'
      onClick={handleClick}
      {...props}
    >
      {children}
    </BoxTextButton>
  );
}
