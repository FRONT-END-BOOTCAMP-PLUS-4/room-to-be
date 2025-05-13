'use client';

import Image from 'next/image';
import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type LightButtonProps = {
  isOn: boolean;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function LightButton({
  isOn,
  className,
  type,
  ...props
}: LightButtonProps) {
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
        src='/assets/icons/sun.svg'
        alt='light-button-icon'
        width={24}
        height={24}
      />
    </button>
  );
}
