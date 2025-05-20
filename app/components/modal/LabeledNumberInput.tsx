'use client';

import React, { useState } from 'react';

interface LabeledNumberInputProps {
  leftLabel?: string; // 왼쪽 라벨 (선택사항)
  unitLabel: string; // 오른쪽 단위 (필수)
  placeholder?: string; // placeholder 값 (기본값 "00")
  value?: number | null;
  onChange?: (value: number | null) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export default function LabeledNumberInput({
  leftLabel,
  unitLabel,
  placeholder = '00',
  value,
  onChange,
  onFocus,
  onBlur,
}: LabeledNumberInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState<string>(
    value !== null && value !== undefined && value !== 0
      ? value.toString()
      : '',
  );

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();

    if (inputValue === '') {
      onChange?.(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (newValue === '') {
      onChange?.(null);
    } else {
      onChange?.(parseFloat(newValue));
    }
  };

  const isValueEmpty = inputValue === '' || inputValue === '0';

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
          inputMode='decimal'
          placeholder={placeholder}
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className='w-full max-w-[130px] bg-transparent outline-none text-white text-[16px] text-right placeholder-white/50 appearance-none 
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
