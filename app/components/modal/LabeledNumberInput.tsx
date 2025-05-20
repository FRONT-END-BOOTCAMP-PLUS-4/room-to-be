'use client';

import React from 'react';

interface LabeledNumberInputProps {
  leftLabel?: string; // 왼쪽 라벨 (선택사항)
  unitLabel: string; // 오른쪽 단위 (필수)
  placeholder?: string; // placeholder 값 (기본값 "00")
  value?: number;
  onChange?: (value: number) => void;
}

export default function LabeledNumberInput({
  leftLabel,
  unitLabel,
  placeholder = '00',
  value,
  onChange,
}: LabeledNumberInputProps) {
  return (
    <div className='w-[230px] h-[42px] bg-white/30 rounded-[10px] px-[14px] py-[10px] text-white text-[12px] flex justify-between items-center'>
      {leftLabel && (
        <span className='text-[12px] leading-[1] flex items-center mr-[6px]'>
          {leftLabel}
        </span>
      )}
      <div className='flex items-center ml-auto'>
        <input
          type='number'
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(parseFloat(e.target.value))}
          className='w-full max-w-[130px] bg-transparent outline-none text-white text-[16px] text-right placeholder-white appearance-none 
          [&::-webkit-outer-spin-button]:appearance-none 
          [&::-webkit-inner-spin-button]:appearance-none'
        />
        <span className='ml-[6px] text-[12px] leading-[1] flex items-center'>
          {unitLabel}
        </span>
      </div>
    </div>
  );
}
