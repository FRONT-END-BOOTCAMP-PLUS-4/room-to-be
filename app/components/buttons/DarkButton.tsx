'use client';

import Image from 'next/image';
import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type DarkButtonProps = {
  isOn: boolean;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function DarkButton({
  isOn,
  className,
  type,
  ...props
}: DarkButtonProps) {
  return (
    <button
      type={type ?? 'button'}
      className={clsx(
        'w-[74px] h-[74px] rounded-[20px] flex items-center justify-center transition transform active:scale-95 hover:scale-105',
        isOn ? 'bg-white/50' : 'bg-white/20',
        className,
      )}
      {...props}
    >
      <Image
        src='/assets/icons/moon.svg'
        alt='dark-button-icon'
        width={21}
        height={21}
      />
    </button>
  );
}
