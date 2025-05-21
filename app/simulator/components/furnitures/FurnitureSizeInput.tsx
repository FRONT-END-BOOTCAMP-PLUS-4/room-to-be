'use client';

import { useEffect, useState } from 'react';

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

  const applyChange = (val: number) => {
    const parsed = Math.max(10, Math.min(3000, Number(val)));
    if (!isNaN(parsed)) {
      onChange(parsed); // 부모 컴포넌트에서 scale까지 처리됨
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setInputValue(newValue);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      applyChange(newValue);
    }, 500);
    setDebounceTimeout(timeout);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      applyChange(inputValue);
    }
  };

  return (
    <div className='flex items-center w-full justify-between'>
      <label className='text-[12px] mr-2 whitespace-nowrap text-white/70'>
        {label}
      </label>
      <input
        type='number'
        min={10}
        max={3000}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className='text-white w-[90px] px-1 py-1 text-right rounded-md text-[14px] border border-transparent bg-transparent focus:outline-none focus:border-black/10 focus:bg-black/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
      />
      <span className='text-[12px] text-white/70'>mm</span>
    </div>
  );
}
