'use client';

import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import Image from 'next/image';

type ProfileButtonProps = {
  className?: string;
  imageSrc?: string | null;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function ProfileButton({
  className,
  type,
  imageSrc,
  ...props
}: ProfileButtonProps) {
  const fallbackImage = '/assets/icons/profile-rogo.svg';
  const isValidImage = imageSrc && imageSrc.trim() !== '';

  return (
    <button
      type={type ?? 'button'}
      className={clsx(
        'w-[149px] h-[149px] flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition active:scale-95',
        className,
      )}
      {...props}
    >
      <Image
        src={isValidImage ? imageSrc! : fallbackImage}
        alt='profile'
        width={55}
        height={56}
      />
    </button>
  );
}
