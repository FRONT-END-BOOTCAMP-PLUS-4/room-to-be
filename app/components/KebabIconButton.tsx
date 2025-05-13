'use client';

import Image from 'next/image';
import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type KebabIconButtonProps = {
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function KebabIconButton({
  className,
  type,
  ...props
}: KebabIconButtonProps) {
  return (
    <button
      type={type ?? 'button'}
      className={clsx('opacity-70 hover:opacity-100', className)}
      {...props}
    >
      <Image src='/assets/icons/kebab.svg' alt='Stop' width={14} height={14} />
    </button>
  );
}
