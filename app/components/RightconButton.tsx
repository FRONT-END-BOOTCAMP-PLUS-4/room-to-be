'use client';

import Image from 'next/image';
import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type RightIconButtonProps = {
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function RightIconButton({
  className,
  type,
  ...props
}: RightIconButtonProps) {
  return (
    <button
      type={type ?? 'button'}
      className={clsx(
        'opacity-70 hover:opacity-100 active:scale-95',
        className,
      )}
      {...props}
    >
      <Image src='/assets/icons/right.svg' alt='Stop' width={46} height={60} />
    </button>
  );
}
