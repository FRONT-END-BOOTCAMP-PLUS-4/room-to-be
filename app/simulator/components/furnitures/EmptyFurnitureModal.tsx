'use client';

import { X } from 'lucide-react';

import BoxTextButton from '@/app/components/buttons/BoxTextButton';

interface Props {
  onClose: () => void;
}

export default function EmptyFurnitureModal({ onClose }: Props) {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <div className='relative bg-[#444] rounded-2xl p-6 w-[320px]'>
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-white hover:text-gray-300'
        >
          <X size={20} />
        </button>
        <p className='text-white text-center text-lg font-semibold mb-4'>
          ⚠️ 저장할 가구가 없습니다
        </p>
        <p className='text-gray-300 text-center text-sm mb-6'>
          가구를 배치한 후 다시 시도해주세요.
        </p>
        <BoxTextButton showImg={false} onClick={onClose} className='w-full'>
          닫기
        </BoxTextButton>
      </div>
    </div>
  );
}
