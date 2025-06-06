'use client';

import { useMemo, useState } from 'react';

import DarkButton from '@/app/components/buttons/DarkButton';
import LightButton from '@/app/components/buttons/LightButton';
import { useResettableFurniture } from '@/app/hooks/useResettableFurniture';
import type { FurnitureStoreInfo } from '@/app/types/furniture';

import { useFurnitureStore } from '@/stores/useFurnitureStore';
import { useLightingStore } from '@/stores/useLightingStore';

import ActionButtons from '../buttons/ActionButtons';
import FurnitureControllerBtn from './FurnitureControllerBtn';
import FurnitureThumbnailInfo from './FurnitureThumbnailInfo';
import LockedScaleSlider from './LockedScaleSlider';
import ScaleLockToggle from './ScaleLockToggle';
import UnlockedScaleInputs from './UnlockedScaleInputs';

export default function FurnitureController({
  mode,
  onSaveClick,
}: {
  mode: 'create' | 'edit';
  onSaveClick: () => void;
}) {
  const {
    furnitures,
    selectedFurnitureId,
    updateFurniture,
    removeFurniture,
    undoFurniture,
    prevFurnitureStates,
  } = useFurnitureStore();

  const [isScaleLocked, setIsScaleLocked] = useState(false);

  const isDay = useLightingStore((state) => state.isDay);
  const setIsDay = useLightingStore((state) => state.setIsDay);

  const selectedFurniture = useMemo(() => {
    return furnitures.find((f) => f.id === selectedFurnitureId) || null;
  }, [furnitures, selectedFurnitureId]);

  const updateSelectedFurniture = (
    updated: Partial<FurnitureStoreInfo>,
    saveHistory = true,
  ) => {
    if (selectedFurniture) {
      updateFurniture(selectedFurniture.id, updated, saveHistory);
    }
  };

  const isUndoAvailable = useMemo(() => {
    if (!selectedFurnitureId) return false;

    const stack = prevFurnitureStates[selectedFurnitureId];
    return Array.isArray(stack) && stack.length >= 2;
  }, [selectedFurnitureId, prevFurnitureStates]);

  const { isResettable, resetFurniture } = useResettableFurniture(
    selectedFurniture,
    updateSelectedFurniture,
  );

  return (
    <div
      className='w-[219px] px-[30px] py-[25px] rounded-[30px] bg-gradient-to-r from-white/10 to-black/20 backdrop-blur-md shadow-[0_0_15px_#00000026] flex flex-col items-center gap-[12px] max-h-[calc(100vh-60px)]
      overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
    >
      {/* 저장, 나가기 버튼 */}
      <ActionButtons mode={mode} onSaveClick={onSaveClick} />

      <div className='flex gap-[10px]'>
        <LightButton onClick={() => setIsDay(true)} isOn={isDay} />
        <DarkButton onClick={() => setIsDay(false)} isOn={!isDay} />
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
              onChange={(updates) => updateSelectedFurniture(updates, true)}
            />
          ) : (
            <UnlockedScaleInputs
              furniture={selectedFurniture}
              onChange={updateSelectedFurniture}
            />
          )}

          <div className='w-full flex flex-col gap-[10px]'>
            {selectedFurniture.placementType === 'floor' && (
              <div className='w-full flex gap-[10px]'>
                <FurnitureControllerBtn
                  width={14}
                  height={14}
                  icon='/assets/icons/rotate-left.svg'
                  onClick={() =>
                    updateSelectedFurniture({
                      rotationY: selectedFurniture.rotationY + Math.PI / 4,
                    })
                  }
                />
                <FurnitureControllerBtn
                  width={14}
                  height={14}
                  icon='/assets/icons/rotate-right.svg'
                  onClick={() =>
                    updateSelectedFurniture({
                      rotationY: selectedFurniture.rotationY - Math.PI / 4,
                    })
                  }
                />
              </div>
            )}

            <FurnitureControllerBtn
              text='이전 상태로 되돌리기'
              onClick={() => undoFurniture(selectedFurnitureId!)}
              disabled={!isUndoAvailable}
            />

            <div className='w-full flex gap-[10px]'>
              <FurnitureControllerBtn
                text='삭제'
                onClick={() => removeFurniture(selectedFurnitureId!)}
              />
              <FurnitureControllerBtn
                text='초기화'
                onClick={() => {
                  resetFurniture();
                  useFurnitureStore
                    .getState()
                    .resetFurnitureHistory(selectedFurnitureId!);
                }}
                disabled={!isResettable}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
