'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import IconButton from '../buttons/IconButton';

interface ModalProps {
  width: string;
  height?: string;
  onBack?: () => void;
  children: React.ReactNode;
}

export default function Modal({
  width,
  height,
  onBack,
  children,
}: ModalProps) {

  const router = useRouter();
  const onClose = () => {
    router.push('/');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg">
      <div
        className="bg-white/30 backdrop-blur-lg rounded-[30px] py-[30px] px-[36px] flex flex-col"
        style={{ width, height }}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            {onBack && (
              <>
                <IconButton imageSrc='/assets/icons/left.svg' width={23} height={36} onClick={onBack} />
                <span className="ml-[26px] text-white text-[36px] font-semibold">
                  Template
                </span>
              </>
            )}
          </div>

          <IconButton imageSrc='/assets/icons/cross.svg' width={28} height={28} onClick={onClose} />
        </div>

        <div className="mt-4 flex flex-1 items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}