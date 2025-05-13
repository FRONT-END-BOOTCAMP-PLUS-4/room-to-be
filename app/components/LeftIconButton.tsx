'use client';

import Image from 'next/image';
import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type LeftIconButtonProps = {
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function LeftIconButton({
  className,
  type,
  ...props
}: LeftIconButtonProps) {
  return (
    <button
      type={type ?? 'button'}
      className={clsx(
        'opacity-70 hover:opacity-100 active:scale-95',
        className,
      )}
      {...props}
    >
      <Image src='/assets/icons/left.svg' alt='Stop' width={46} height={60} />
    </button>
  );
}
