'use client';

import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';

import { fetchFurnitureByPlacementType } from '@/apis/furnitures';
import { useFurnitureStore } from '@/stores/useFurnitureStore';
import { useRoomSizeStore } from '@/stores/useRoomSizeStore';

import { Furnitures } from '../types/furniture';
import FurnitureController from './components/furnitures/FurnitureController';
import FurnitureModel from './components/furnitures/FurnitureModel';
import BackgroundController from './components/room/BackgroundController';
import BackgroundSelector from './components/room/BackgroundSelector';
import CameraController from './components/room/CameraController';
import Lighting from './components/room/Lighting';
import Room from './components/room/Room';
import FurnitureSidebar from './components/sidebar/FurnitureSidebar';

export default function SimulatorPage() {
  const {
    width: storeWidth,
    height: storeHeight,
    wallHeight: storeWallHeight,
  } = useRoomSizeStore();

  const roomWidth = storeWidth;
  const roomHeight = storeHeight;
  const floorExtension = 0.1;
  const wallExtension = 0.1;

  const extendedWidth = roomWidth + wallExtension * 2;
  const extendedHeight = roomHeight + wallExtension * 2;

  const roomBoundary = {
    xMin: wallExtension,
    xMax: extendedWidth - wallExtension,
    zMin: wallExtension,
    zMax: extendedHeight - wallExtension,
    yMin: 0,
    yMax: storeWallHeight || 2.5,
  };

  // Zustand에서 상태 가져오기
  const furnitures = useFurnitureStore((state) => state.furnitures);

  // 방 크기에 따라 카메라 위치 조정
  const cameraDistance = Math.max(roomWidth, roomHeight) * 1.4;

  return (
    <div className='relative w-full h-screen overflow-hidden'>
      {/* Canvas */}
      <div className='absolute top-0 left-0 w-full h-full z-0'>
        <Canvas
          shadows
          camera={{
            position: [cameraDistance, cameraDistance, cameraDistance],
            fov: 50,
          }}
          className='w-full h-full'
          onPointerMissed={() => {
            useFurnitureStore.getState().clearSelection();
          }}
        >
          <Suspense fallback={null}>
            <BackgroundController />
            <Room
              width={roomWidth}
              height={roomHeight}
              wallTexture='/assets/images/testwall.jpg'
              floorTexture='/assets/images/woodfloor.png'
              floorExtension={floorExtension}
            />
            {furnitures.map((furniture) => (
              <FurnitureModel
                key={furniture.id}
                roomBoundary={roomBoundary}
                {...furniture}
              />
            ))}
            <Lighting />
            <CameraController width={roomWidth} height={roomHeight} />
          </Suspense>
        </Canvas>
      </div>

      {/* 사이드바 */}
      <div className='absolute top-0 left-0 z-30 w-80 h-full'>
        <FurnitureSidebar
          fetchFurnitureByPlacementType={fetchFurnitureByPlacementType}
        />
      </div>

      {/* 오른쪽 UI 버튼들 */}
      <div className='absolute top-[50px] right-[70px] z-30'>
        <BackgroundSelector />
      </div>
      <div className='absolute top-[140px] right-[70px] z-30'>
        <FurnitureController />
      </div>
    </div>
  );
}
