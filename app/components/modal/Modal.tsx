'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import IconButton from '../buttons/IconButton';

interface ModalProps {
  width: string;
  height?: string;
  onBack?: () => void;
  onClose?: () => void;
  showBackIconOnly?: boolean;
  onBackdropClick?: () => void;
  children: React.ReactNode;
  shouldAnimate?: boolean;
}

export default function Modal({
  width,
  height,
  onBack,
  onClose,
  showBackIconOnly = false,
  onBackdropClick,
  children,
  shouldAnimate = false,
}: ModalProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (shouldAnimate) {
      setIsVisible(true);
    }
  }, [shouldAnimate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);

    setTimeout(() => {
      if (onClose) {
        onClose();
      } else {
        router.push('/');
      }
    }, 300);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onBackdropClick) {
      onBackdropClick();
    } else if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const backdropClasses = shouldAnimate
    ? `transition-all duration-300 ease-out ${
        isVisible && !isClosing
          ? 'backdrop-blur-2xl bg-black/20'
          : 'backdrop-blur-none bg-black/0'
      }`
    : isClosing
      ? 'transition-all duration-300 ease-out backdrop-blur-none bg-black/0'
      : 'backdrop-blur-2xl bg-black/20';

  const modalClasses = shouldAnimate
    ? `transition-all duration-300 ease-out ${
        isVisible && !isClosing
          ? 'scale-100 opacity-100 translate-y-0'
          : 'scale-75 opacity-0 translate-y-8'
      }`
    : isClosing
      ? 'transition-all duration-300 ease-out scale-75 opacity-0 translate-y-8'
      : 'scale-100 opacity-100 translate-y-0';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${backdropClasses}`}
      onClick={handleBackgroundClick}
    >
      <div
        className={`bg-white/30 backdrop-blur-lg rounded-[30px] py-[30px] px-[36px] flex flex-col ${modalClasses}`}
        style={{ width, height }}
      >
        <div className='flex items-center justify-between w-full'>
          <div className='flex items-center'>
            {onBack && (
              <>
                <IconButton
                  imageSrc='/assets/icons/left.svg'
                  width={23}
                  height={36}
                  onClick={handleBack}
                />
                {!showBackIconOnly && (
                  <span className='ml-[26px] text-white text-[30px] font-semibold'>
                    Template
                  </span>
                )}
              </>
            )}
          </div>

          <IconButton
            imageSrc='/assets/icons/cross.svg'
            width={28}
            height={28}
            onClick={handleClose}
          />
        </div>

        <div className='mt-4 flex flex-1 items-center justify-center'>
          {children}
        </div>
      </div>
    </div>
  );
}
