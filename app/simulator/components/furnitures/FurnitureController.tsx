'use client';

import { useMemo, useState } from 'react';

import DarkButton from '@/app/components/buttons/DarkButton';
import LightButton from '@/app/components/buttons/LightButton';
import { useResettableFurniture } from '@/app/hooks/useResettableFurniture';
import type { FurnitureStoreInfo } from '@/app/types/furniture';

import { useFurnitureStore } from '@/stores/useFurnitureStore';
import { useLightingStore } from '@/stores/useLightingStore';
import { useViewStore } from '@/stores/useViewStore';

import FurnitureControllerBtn from './FurnitureControllerBtn';
import FurnitureThumbnailInfo from './FurnitureThumbnailInfo';
import LockedScaleSlider from './LockedScaleSlider';
import ScaleLockToggle from './ScaleLockToggle';
import UnlockedScaleInputs from './UnlockedScaleInputs';

const VALID_ANGLES = [45, 135, 225, 315];
const TOP_VIEW_ANGLES = [0, 90, 180, 270];

function convertForm3DToTop(angle3D: number): number {
  const index3D = VALID_ANGLES.indexOf(angle3D);
  if (index3D !== -1) {
    return TOP_VIEW_ANGLES[index3D];
  }
  return 0;
}

function convertFormTopTo3D(angleTop: number): number {
  const indexTop = TOP_VIEW_ANGLES.indexOf(angleTop);
  if (indexTop !== -1) {
    return VALID_ANGLES[indexTop];
  }

  return 45;
}

export default function FurnitureController() {
  const {
    furnitures,
    selectedFurnitureId,
    updateFurniture,
    removeFurniture,
    undoFurniture,
    prevFurnitureStates,
  } = useFurnitureStore();
  const [isScaleLocked, setIsScaleLocked] = useState(false);

  const angle = useViewStore((s) => s.angle);
  const setAngle = useViewStore((s) => s.setAngle);
  const isTopView = useViewStore((s) => s.isTopView);
  const setIsTopView = useViewStore((s) => s.setIsTopView);

  const isDay = useLightingStore((state) => state.isDay);
  const setIsDay = useLightingStore((state) => state.setIsDay);

  const selectedFurniture = useMemo(() => {
    return furnitures.find((f) => f.id === selectedFurnitureId) || null;
  }, [furnitures, selectedFurnitureId]);

  const updateSelectedFurniture = (updated: Partial<FurnitureStoreInfo>) => {
    if (selectedFurniture) {
      updateFurniture(selectedFurniture.id, updated);
    }
  };

  // undo 가능한 상태인지 확인 (명확하게 null이 아닌 이전 상태가 존재할 경우만 true)
  const isUndoAvailable = useMemo(() => {
    if (!selectedFurnitureId) return false;

    const prev = prevFurnitureStates[selectedFurnitureId];
    const current = furnitures.find((f) => f.id === selectedFurnitureId);

    if (!prev || !current) return false;

    // 이전 상태와 현재 상태가 다를 때만 undo 가능
    return JSON.stringify(prev) !== JSON.stringify(current);
  }, [selectedFurnitureId, furnitures, prevFurnitureStates]);

  const { isResettable, resetFurniture } = useResettableFurniture(
    selectedFurniture,
    updateSelectedFurniture,
  );

  // 방 회전
  const handleRoomRotate = () => {
    const currentAngles = isTopView ? TOP_VIEW_ANGLES : VALID_ANGLES;
    const currentIndex = currentAngles.indexOf(angle);
    const nextIndex = (currentIndex + 1) % currentAngles.length;
    const newAngle = currentAngles[nextIndex];
    setAngle(newAngle);
  };

  // 뷰 모드 전환
  const handleViewToggle = () => {
    if (isTopView) {
      const new3DAngle = convertFormTopTo3D(angle);
      setAngle(new3DAngle);
      setIsTopView(false);
    } else {
      const newTopAngle = convertForm3DToTop(angle);
      setAngle(newTopAngle);
      setIsTopView(true);
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
          onClick={handleRoomRotate}
        />
        <FurnitureControllerBtn
          text={isTopView ? '3D 뷰' : '2D 뷰'}
          onClick={handleViewToggle}
        />
      </div>

      {/* 조명 모드 버튼 */}
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
                    rotationY: selectedFurniture.rotationY + Math.PI / 4, // 반시계 방향으로 회전
                  });
                }}
              />
              <FurnitureControllerBtn
                width={14}
                height={14}
                icon='/assets/icons/rotate-right.svg'
                onClick={() => {
                  updateSelectedFurniture({
                    rotationY: selectedFurniture.rotationY - Math.PI / 4, // 시계 방향으로 회전
                  });
                }}
              />
            </div>
            <FurnitureControllerBtn
              text='이전 상태로 되돌리기'
              onClick={() => {
                if (selectedFurnitureId) {
                  undoFurniture(selectedFurnitureId);
                }
              }}
              disabled={!isUndoAvailable}
            />
            <div className='w-full flex gap-[10px]'>
              <FurnitureControllerBtn
                text='삭제'
                onClick={() => removeFurniture(selectedFurnitureId!)}
              />
              <FurnitureControllerBtn
                text='초기화'
                onClick={resetFurniture}
                disabled={!isResettable}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
