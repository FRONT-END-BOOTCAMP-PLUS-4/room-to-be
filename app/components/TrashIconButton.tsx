'use client';

import Image from 'next/image';
import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type TrashIconButtonProps = {
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function TrashIconButton({
  className,
  type,
  ...props
}: TrashIconButtonProps) {
  return (
    <button
      type={type ?? 'button'}
      className={clsx(
        'w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition active:scale-95',
        className,
      )}
      {...props}
    >
      <Image src='/assets/icons/trash.svg' alt='share' width={15} height={15} />
    </button>
  );
}
