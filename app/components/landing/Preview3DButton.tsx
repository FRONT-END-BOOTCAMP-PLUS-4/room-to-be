'use client';

import { ButtonHTMLAttributes } from 'react';
import { useRouter } from 'next/navigation';

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

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push(href);
    // 혹시 onClick prop이 들어오면 실행
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
