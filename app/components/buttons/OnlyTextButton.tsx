'use client';

import Image from 'next/image';
import { ReactNode, ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type OnlyTextButtonProps = {
  children: ReactNode;
  className?: string;
  showImage?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function OnlyTextButton({
  children,
  className,
  type,
  showImage,
  ...props
}: OnlyTextButtonProps) {
  return (
    <button
      type={type ?? 'button'}
      className={clsx(
        'p-4 flex items-center justify-center text-white/70 rounded-[20px] gap-2 hover:text-white text-lg font-normal leading-relaxed transition active:scale-95',
        className,
      )}
      {...props}
    >
      {children}
      {showImage && (
        <Image
          src='/assets/icons/go-arrow.svg'
          alt='go-arrow'
          width={19}
          height={4.5}
        />
      )}
    </button>
  );
}
