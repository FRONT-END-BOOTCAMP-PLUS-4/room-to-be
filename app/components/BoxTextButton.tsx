'use client';

import clsx from 'clsx';
import { ReactNode, ButtonHTMLAttributes } from 'react';

type BoxTextButtonProps = {
  children: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function BoxTextButton({
  children,
  className,
  type,
  ...props
}: BoxTextButtonProps) {
  return (
    <button
      type={type ?? 'button'}
      className={clsx(
        'p-2 px-4 flex items-center justify-center rounded-[10px] border border-white bg-white/30 text-white text-base font-normal leading-none hover:bg-white/40 transition active:scale-95',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
