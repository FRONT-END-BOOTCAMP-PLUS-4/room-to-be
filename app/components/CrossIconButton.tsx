'use client';

import Image from 'next/image';
import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type CrossIconButtonProps = {
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function CrossIconButton({
  className,
  type,
  ...props
}: CrossIconButtonProps) {
  return (
    <button
      type={type ?? 'button'}
      className={clsx(
        'opacity-70 hover:opacity-100 active:scale-95',
        className,
      )}
      {...props}
    >
      <Image src='/assets/icons/cross.svg' alt='Stop' width={41} height={41} />
    </button>
  );
}
