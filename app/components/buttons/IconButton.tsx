'use client';

import Image from 'next/image';
import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type IconButtonProps = {
  className?: string;
  imageSrc: string;
  width: number;
  height: number;
  onClick?: () => void;
} & ButtonHTMLAttributes<HTMLButtonElement>;
/**
 * Icon이미지 버튼
 * @param width 이미지 가로 길이
 * @param height 이미지 세로 길이
 * @param className 버튼 관련 사이즈는 똑같이 className으로 조절
 * @returns
 */
export default function IconButton({
  className,
  type,
  width,
  height,
  imageSrc,
  onClick,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type ?? 'button'}
      className={clsx(
        'opacity-70 hover:opacity-100 active:scale-95 p-1',
        className,
      )}
      onClick={onClick}
      {...props}
    >
      <Image width={width} height={height} src={imageSrc} alt={imageSrc} />
    </button>
  );
}
