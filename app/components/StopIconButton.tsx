'use client';

import Image from 'next/image';
import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type StopIconButtonProps = {
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function StopIconButton({
  className,
  type,
  ...props
}: StopIconButtonProps) {
  return (
    <button
      type={type ?? 'button'}
      className={clsx(
        'opacity-70 hover:opacity-100 active:scale-95',
        className,
      )}
      {...props}
    >
      <Image src='/assets/icons/stop.svg' alt='Stop' width={14} height={14} />
    </button>
  );
}
