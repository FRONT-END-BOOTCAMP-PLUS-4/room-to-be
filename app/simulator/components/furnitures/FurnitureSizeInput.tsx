'use client';

import { useState, useEffect } from 'react';

interface FurnitureSizeInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
}

export default function FurnitureSizeInput({
  label,
  value,
  onChange,
}: FurnitureSizeInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  // 외부 값이 바뀌면 동기화
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // 입력이 끝난 후 일정 시간 후에 onChange 호출
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setInputValue(newValue);

    // 기존 타이머가 있으면 클리어
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // 새로운 타이머 설정
    const timeout = setTimeout(() => {
      const parsed = Math.max(10, Math.min(3000, Number(newValue)));
      if (!isNaN(parsed)) {
        onChange(parsed);
      }
    }, 500); // 500ms 후에 적용
    setDebounceTimeout(timeout);
  };

  // 엔터 키를 눌렀을 때도 값을 즉시 적용
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const parsed = Math.max(10, Math.min(3000, Number(inputValue)));
      if (!isNaN(parsed)) {
        onChange(parsed);
      }
    }
  };

  return (
    <div className='flex items-center w-full justify-between gap-2'>
      <label className='text-sm mr-2 whitespace-nowrap'>{label}</label>
      <input
        type='number'
        min={10}
        max={3000}
        step={1}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className='w-[90px] px-2 py-1 text-right rounded-md text-sm border border-transparent bg-transparent focus:outline-none focus:border-black/10 focus:bg-black/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
      />
      <span className='text-sm'>mm</span>
      
    </div>
  );
}
