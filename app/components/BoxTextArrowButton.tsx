'use client';

import Image from 'next/image';
import { ReactNode, ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type BoxTextArrowButtonProps = {
  children: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function BoxTextArrowButton({
  children,
  className,
  type,
  ...props
}: BoxTextArrowButtonProps) {
  return (
    <button
      type={type ?? 'button'}
      className={clsx(
        'p-4 flex items-center justify-center gap-2 rounded-[20px] border border-white bg-white/20 text-white text-lg font-normal leading-relaxed hover:bg-white/30 transition active:scale-95',
        className,
      )}
      {...props}
    >
      {children}

      <Image
        src='/assets/icons/go-arrow.svg'
        alt='go-arrow'
        width={19}
        height={4.5}
      />
    </button>
  );
}
