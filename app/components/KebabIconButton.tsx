'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import AirplaneIconButton from './AirplaneIconButton';
import TrashIconButton from './TrashIconButton';

export default function KebabIconButton() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        type='button'
        onClick={() => setOpen((prev) => !prev)}
        className='opacity-70 hover:opacity-100 transition'
      >
        <Image
          src='/assets/icons/kebab.svg'
          alt='menu'
          width={14}
          height={14}
        />
      </button>

      {open && (
        <div
          className={clsx(
            'absolute -right-14 -bottom-12 z-50',
            'bg-[#1e1e1e] rounded-full px-3 py-2 shadow-md',
            'flex gap-2 items-center',
          )}
        >
          <AirplaneIconButton />
          <TrashIconButton />
        </div>
      )}
    </div>
  );
}
