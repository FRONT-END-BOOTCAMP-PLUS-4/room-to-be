'use client';

import { useState, useMemo } from 'react';

import FurnitureThumbnailInfo from './FurnitureThumbnailInfo';
import ScaleLockToggle from './ScaleLockToggle';
import LockedScaleSlider from './LockedScaleSlider';
import UnlockedScaleInputs from './UnlockedScaleInputs';

import LightButton from '@/app/components/buttons/LightButton';
import DarkButton from '@/app/components/buttons/DarkButton';
import FurnitureControllerBtn from './FurnitureControllerBtn';

import { useFurnitureStore } from '@/stores/useFurnitureStore';
import type { FurnitureStoreProps } from '@/app/types/furniture';

export default function FurnitureController() {
  const { furnitures, selectedFurnitureId, updateFurniture } = useFurnitureStore();
  const [isScaleLocked, setIsScaleLocked] = useState(false);
  const [isLight, setIsLight] = useState(true);

  const selectedFurniture = useMemo(() => {
    return furnitures.find((f) => f.id === selectedFurnitureId) || null;
  }, [furnitures, selectedFurnitureId]);

  const updateSelectedFurniture = (updated: Partial<FurnitureStoreProps>) => {
    if (selectedFurniture) {
      updateFurniture(selectedFurniture.id, updated);
    }
  };

  return (
    <div className='w-[219px] px-[30px] py-[25px] rounded-[30px] bg-gradient-to-r from-white/10 to-black/20 backdrop-blur-md shadow-[0_0_15px_#00000026] flex flex-col items-center justify-center gap-4'>
      {/* 카메라 모드 버튼 */}
      <div className='w-full flex gap-[10px]'>
        <FurnitureControllerBtn
          width={14}
          height={14}
          icon='/assets/icons/view-mode.svg'
        />
        <FurnitureControllerBtn text='3D 뷰' />
      </div>

      {/* 조명 모드 버튼 */}
      <div className='flex gap-[10px]'>
        <LightButton
          onClick={() => setIsLight(true)}
          isOn={isLight ? true : false}
        />
        <DarkButton
          onClick={() => setIsLight(false)}
          isOn={isLight ? false : true}
        />
      </div>

      {selectedFurniture && (
        <>
          <div className='w-[156px] h-px bg-white/20' />
          <FurnitureThumbnailInfo
            name={selectedFurniture.name}
            thumbnailUrl={selectedFurniture.thumbnailUrl}
          />

          <ScaleLockToggle
            checked={isScaleLocked}
            onChange={setIsScaleLocked}
          />

          {isScaleLocked ? (
            <LockedScaleSlider
              furniture={selectedFurniture}
              onChange={updateSelectedFurniture}
            />
          ) : (
            <UnlockedScaleInputs
              furniture={selectedFurniture}
              onChange={updateSelectedFurniture}
            />
          )}

          {/* 가구 조작 버튼 모음 */}
          <div className='w-full flex flex-col gap-[10px]'>
            <div className='w-full flex gap-[10px]'>
              <FurnitureControllerBtn
                width={14}
                height={14}
                icon='/assets/icons/rotate-left.svg'
                onClick={() => {
                  updateSelectedFurniture({
                    rotationY: selectedFurniture.rotationY + Math.PI / 4,
                  });
                }}
              />
              <FurnitureControllerBtn
                width={14}
                height={14}
                icon='/assets/icons/rotate-right.svg'
                onClick={() => {
                  updateSelectedFurniture({
                    rotationY: selectedFurniture.rotationY - Math.PI / 4,
                  });
                }}
              />
            </div>
            <FurnitureControllerBtn text='이전 상태로 되돌리기' />
            <div className='w-full flex gap-[10px]'>
              <FurnitureControllerBtn text='삭제' />
              <FurnitureControllerBtn text='초기화' />
            </div>
          </div>
        </>
      )}
    </div>
  );
}