'use client';

import Image from 'next/image';
import React from 'react';

interface ModalProps {
  width: string;
  height: string;
  onClose: () => void;
  onBack?: () => void;
  children: React.ReactNode;
}

export default function Modal({
  width,
  height,
  onClose,
  onBack,
  children,
}: ModalProps) {
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
                <button
                  onClick={onBack}
                  className="text-white hover:text-gray-300"
                >
                  <Image
                    src="/assets/icons/left.svg"
                    alt="뒤로가기"
                    width={23}
                    height={28}
                  />
                </button>
                <span className="ml-[26px] text-white text-lg font-semibold">
                  Template
                </span>
              </>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-white hover:text-gray-300"
          >
            <Image
              src="/assets/icons/cross.svg"
              alt="모달 닫기"
              width={28}
              height={28}
            />
          </button>
        </div>

        <div className="mt-4 flex flex-1 items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}