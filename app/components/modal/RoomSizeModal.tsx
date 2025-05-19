'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Modal from './Modal';
import BoxTextButton from '../buttons/BoxTextButton';
import LabeledNumberInput from './LabeledNumberInput';
import {
  useRoomSizeStore,
  pyeongToRoomDimensions,
} from '@/stores/useRoomSizeStore';

interface RoomSizeModalProps {
  onBack: () => void;
}

export default function RoomSizeModal({ onBack }: RoomSizeModalProps) {
  const router = useRouter();

  const {
    mode,
    pyeong,
    width,
    height,
    wallHeight,
    setMode,
    setPyeong,
    setDimensions,
  } = useRoomSizeStore();

  const [localPyeong, setLocalPyeong] = useState<number>(pyeong);
  const [localWidth, setLocalWidth] = useState<number>(width);
  const [localHeight, setLocalHeight] = useState<number>(height);
  const [localWallHeight, setLocalWallHeight] = useState<number>(wallHeight);

  // 모드 변경 시 로컬 상태 업데이트
  useEffect(() => {
    if (mode === 'pyeong') {
      // 평수 모드로 전환 시, 현재 가로/세로 값에서 평수 계산
      const area = localWidth * localHeight;
      const calculatedPyeong = Math.round((area / 3.3058) * 100) / 100;
      setLocalPyeong(calculatedPyeong);
    } else {
      // 미터 모드로 전환 시, 현재 평수에서 가로/세로 계산
      const dimensions = pyeongToRoomDimensions(localPyeong);
      setLocalWidth(dimensions.width);
      setLocalHeight(dimensions.height);
    }
  }, [mode]);

  const handleGoToInterior = () => {
    if (mode === 'pyeong') {
      setPyeong(localPyeong);
    } else {
      setDimensions(localWidth, localHeight, localWallHeight);
    }

    router.push('/simulator');
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
            onChange={setLocalPyeong}
          />
        ) : (
          <div className='flex flex-col gap-[10px]'>
            <LabeledNumberInput
              leftLabel='가로'
              unitLabel='m'
              placeholder='00'
              value={localWidth}
              onChange={setLocalWidth}
            />
            <LabeledNumberInput
              leftLabel='세로'
              unitLabel='m'
              placeholder='00'
              value={localHeight}
              onChange={setLocalHeight}
            />
            <LabeledNumberInput
              leftLabel='높이'
              unitLabel='m'
              placeholder='00'
              value={localWallHeight}
              onChange={setLocalWallHeight}
            />
          </div>
        )}

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
