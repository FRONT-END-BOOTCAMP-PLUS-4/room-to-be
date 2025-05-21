'use client';

import React, { useRef } from 'react';

import CircleIconButton from '@/app/components/buttons/CircleIconButton';

interface OverflowMenuProps {
  isOpen: boolean;
  setIsOpen: (_isOpen: boolean) => void;
  onDelete?: () => void;
}

export default function OverflowMenu({
  isOpen,
  setIsOpen,
  onDelete,
}: OverflowMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className='relative' ref={menuRef} onClick={handleMenuClick}>
      <button
        className="w-5 h-5 bg-[url('/assets/icons/more.svg')] bg-no-repeat bg-center bg-contain"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      ></button>

      {isOpen && (
        <div
          className='absolute top-8 right-0 bg-black/30 rounded-full py-2 px-[16px] flex items-center gap-3 z-20 backdrop-blur-md'
          style={{
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          }}
        >
          <CircleIconButton imageSrc='/assets/icons/share.svg' />
          <CircleIconButton
            imageSrc='/assets/icons/trash.svg'
            onClick={(e) => {
              e.stopPropagation(); // 메뉴 닫힘 방지
              onDelete?.();
            }}
          />
        </div>
      )}
    </div>
  );
}
