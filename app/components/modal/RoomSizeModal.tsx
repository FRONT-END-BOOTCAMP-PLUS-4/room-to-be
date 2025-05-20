'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Modal from './Modal';
import BoxTextButton from '../buttons/BoxTextButton';
import LabeledNumberInput from './LabeledNumberInput';
import useRoomSizeForm from '@/app/hooks/useRoomSizeForm';

interface RoomSizeModalProps {
  onBack: () => void;
}

export default function RoomSizeModal({ onBack }: RoomSizeModalProps) {
  const router = useRouter();
  const {
    mode,
    localPyeong,
    localWidth,
    localHeight,
    localWallHeight,
    error,
    setMode,
    handlePyeongChange,
    handleDimensionChange,
    handleWallHeightChange,
    handleSubmit,
    handleFieldFocus,
  } = useRoomSizeForm();

  const handleGoToInterior = () => {
    if (handleSubmit()) {
      router.push('/simulator');
    }
  };

  return (
    <Modal width='340px' onBack={onBack} showBackIconOnly>
      <div className='flex flex-col w-full justify-center text-center items-center pb-[15px]'>
        <span className='text-white text-[16px] mb-5'>
          방 크기를 입력해 주세요.
        </span>

        <div className='w-[182px] flex justify-between mb-6 text-white text-[16px]'>
          <label className='flex items-center gap-3'>
            <input
              type='radio'
              name='mode'
              value='pyeong'
              className='appearance-none w-[14px] h-[14px] rounded-full border border-white bg-white/20 checked:bg-white checked:ring-1 checked:ring-white cursor-pointer'
              checked={mode === 'pyeong'}
              onChange={() => setMode('pyeong')}
            />
            평수
          </label>
          <label className='flex items-center gap-3'>
            <input
              type='radio'
              name='mode'
              value='meter'
              className='appearance-none w-[14px] h-[14px] rounded-full border border-white bg-white/20 checked:bg-white checked:ring-1 checked:ring-white cursor-pointer'
              checked={mode === 'meter'}
              onChange={() => setMode('meter')}
            />
            m (미터)
          </label>
        </div>

        {mode === 'pyeong' ? (
          <LabeledNumberInput
            unitLabel='평'
            placeholder='00'
            value={localPyeong}
            onChange={handlePyeongChange}
            onFocus={() => handleFieldFocus('pyeong')}
          />
        ) : (
          <div className='flex flex-col gap-[10px]'>
            <LabeledNumberInput
              leftLabel='가로'
              unitLabel='m'
              placeholder='00'
              value={localWidth}
              onChange={(value) => handleDimensionChange('width', value)}
              onFocus={() => handleFieldFocus('width')}
            />
            <LabeledNumberInput
              leftLabel='세로'
              unitLabel='m'
              placeholder='00'
              value={localHeight}
              onChange={(value) => handleDimensionChange('height', value)}
              onFocus={() => handleFieldFocus('height')}
            />
            <LabeledNumberInput
              leftLabel='높이'
              unitLabel='m'
              placeholder='00'
              value={localWallHeight}
              onChange={handleWallHeightChange}
              onFocus={() => handleFieldFocus('wallHeight')}
            />
          </div>
        )}

        {error && <div className='mt-2 text-red-400 text-sm'>{error}</div>}

        <BoxTextButton
          showImg
          onClick={handleGoToInterior}
          className='mt-[26px] rounded-lg w-[230px] text-sm py-[10px] h-10'
        >
          3D 인테리어 하러가기
        </BoxTextButton>
      </div>
    </Modal>
  );
}
