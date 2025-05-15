'use client';

import Image from 'next/image';
import { ReactNode, ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type BoxTextButtonProps = {
  showImg?: boolean;
  width?: number;
  height?: number;
  children: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function BoxTextButton({
  showImg = false,
  children,
  width = 19,
  height = 4.5,
  className,
  type,
  ...props
}: BoxTextButtonProps) {
  return (
    <button
      type={type ?? 'button'}
      className={clsx(
        'flex px-4  items-center justify-center gap-2  border border-white bg-white/20 text-white text-lg  hover:bg-white/30 transition active:scale-95',
        showImg
          ? 'py-4 h-[58px] font-normal rounded-[20px]'
          : 'py-2 h-[34px] text-sm rounded-[10px]',
        className,
      )}
      {...props}
    >
      {children}
      {showImg && (
        <Image
          src='/assets/icons/go-arrow.svg'
          alt='go-arrow'
          width={width}
          height={height}
        />
      )}
    </button>
  );
}
