'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect } from 'react';

import Room from './components/room/Room';
import Lighting from './components/room/Lighting';
import CameraController from './components/room/CameraController';
import BackgroundController from './components/room/BackgroundController';
import BackgroundSelector from './components/room/BackgroundSelector';
import FurnitureModel from './components/furnitures/FurnitureModel';
import FurnitureController from './components/furnitures/FurnitureController';

import { useFurnitureStore } from '@/stores/useFurnitureStore';
import { Furnitures } from '../types/furniture';

export default function SimulatorPage() {
  const roomWidth = 4;
  const roomHeight = 4;
  const floorExtension = 0.1;
  const wallExtension = 0.1;

  const extendedWidth = roomWidth + wallExtension * 2;
  const extendedHeight = roomHeight + wallExtension * 2;

  const roomBoundary = {
    xMin: -wallExtension,
    xMax: extendedWidth - wallExtension,
    zMin: -wallExtension,
    zMax: extendedHeight - wallExtension,
    yMin: 0,
    yMax: 2.5,
  };

  // Zustand에서 상태 가져오기
  const furnitures = useFurnitureStore((state) => state.furnitures);
  const setFurnitures = useFurnitureStore((state) => state.setFurnitures);

  useEffect(() => {
    // 초기 가구 세팅
    const initialFurnitures: Furnitures[] = [
      {
        id: '아이디1',
        furnitureId: '아이디1',
        name: 'f_이케아 트롤리',
        thumbnailUrl: '/assets/models/ikea.png',
        modelUrl: '/assets/models/ikea_cart.glb',
        positionX: 2,
        positionY: 0,
        positionZ: 2,
        rotationY: 0,
        scaleX: 0.01,
        scaleY: 0.01,
        scaleZ: 0.01,
        placementType: 'floor',
        category: 'cart',
      },
      {
        id: '아이디2',
        furnitureId: '아이디2',
        name: '램프',
        thumbnailUrl: '/assets/models/ikea.png',
        modelUrl: '/assets/models/banker_lamp.glb',
        positionX: 3,
        positionY: 0,
        positionZ: 3,
        rotationY: 0,
        scaleX: 1,
        scaleY: 1,
        scaleZ: 1,
        placementType: 'floor',
        category: 'lamp',
      },
      {
        id: '아이디3',
        furnitureId: '아이디3',
        name: 'f_테이블',
        thumbnailUrl: '/assets/models/ikea.png',
        modelUrl: '/assets/models/table.glb',
        positionX: 3,
        positionY: 0,
        positionZ: 1,
        rotationY: 0,
        scaleX: 0.01,
        scaleY: 0.01,
        scaleZ: 0.01,
        placementType: 'floor',
        category: 'table',
      },
      {
        id: '아이디4',
        furnitureId: '아이디4',
        name: '창문',
        thumbnailUrl: '/assets/models/ikea.png',
        modelUrl: '/assets/models/window.glb',
        positionX: 3,
        positionY: 1,
        positionZ: 1,
        rotationY: 0,
        scaleX: 1,
        scaleY: 1,
        scaleZ: 1,
        placementType: 'wall',
        category: 'window',
      },
    ];

    setFurnitures(initialFurnitures);
  }, [setFurnitures]);

  return (
    <div className='w-full h-screen relative'>
      <div className='absolute top-[50px] right-[70px] z-30'>
        <BackgroundSelector />
      </div>

      <div className='absolute top-[140px] right-[70px] z-30'>
        <FurnitureController />
      </div>

      <Canvas
        shadows
        camera={{ position: [5, 5, 5], fov: 50 }}
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
          {/* 가구 배열을 map으로 렌더링 */}
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
  );
}
