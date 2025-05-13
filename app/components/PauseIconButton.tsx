'use client';

import Image from 'next/image';
import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type PauseIconButtonProps = {
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function PauseIconButton({
  className,
  type,
  ...props
}: PauseIconButtonProps) {
  return (
    <button
      type={type ?? 'button'}
      className={clsx(
        'opacity-70 hover:opacity-100 active:scale-95',
        className,
      )}
      {...props}
    >
      <Image src='/assets/icons/pause.svg' alt='Stop' width={14} height={14} />
    </button>
  );
}
