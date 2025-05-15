'use client'

import Image from "next/image";
import BoxTextButton from "../buttons/BoxTextButton";

interface StartModalItemProps {
  alt: string;
  src: string;
  contentText: string;
  btnText: string;
  onClick: () => void;
}

export default function StartModalItem({ alt, src, contentText, btnText, onClick }:StartModalItemProps) {
  return (
    <div className='flex flex-col justify-center items-center'>
      <Image
        width={185}
        height={214}
        alt={alt}
        src={src}
      />
      <span className='text-[16px] text-white mt-[42px] mb-4'>
        {contentText}
      </span>
      <BoxTextButton showImg onClick={onClick}>{btnText}</BoxTextButton>
    </div>
  );
}
