'use client';

import Image from 'next/image';
import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type ObjectButtonProps = {
  className?: string;
  imageSrc?: string | null;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function ObjectButton({
  className,
  type,
  imageSrc,
  ...props
}: ObjectButtonProps) {
  const fallbackImage = '/assets/icons/exam-object.svg';
  const isValidImage = imageSrc && imageSrc.trim() !== '';

  return (
    <button
      type={type ?? 'button'}
      className={clsx(
        'w-24 h-24 bg-white/50 rounded-[20px] flex items-center justify-center hover:bg-white/30 transition transform active:scale-95 hover:scale-105',
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
