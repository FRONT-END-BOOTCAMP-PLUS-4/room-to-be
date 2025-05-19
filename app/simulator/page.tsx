'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';

import Room from './components/room/Room';
import Lighting from './components/room/Lighting';
import CameraController from './components/room/CameraController';
import BackgroundController from './components/room/BackgroundController';
import BackgroundSelector from './components/room/BackgroundSelector';

import { useFurnitureStore } from '@/stores/useFurnitureStore';
import FurnitureModel from './components/furnitures/FurnitureModel';
import FurnitureController from './components/furnitures/FurnitureController';

export default function SimulatorPage() {
  const roomWidth = 4;
  const roomHeight = 4;
  const floorExtension = 0.1;

  // 방 범위 계산
  const roomBoundary = {
    xMin: 0,
    xMax: roomWidth,
    zMin: 0,
    zMax: roomHeight,
    yFloor: 0,
    yWall: 2.5,
  };

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
          <FurnitureModel
            roomBoundary={roomBoundary}
            id='아아디'
            name='f_이케아 트롤리'
            thumbnailUrl='/assets/models/ikea.png'
            modelUrl={'/assets/models/ikea_cart.glb'}
            position={[2, 0, 2]}
            rotationY={0}
            scale={[0.01, 0.01, 0.01]}
          />
          <FurnitureModel
            roomBoundary={roomBoundary}
            id='아이디3'
            name='램프'
            thumbnailUrl='/assets/models/ikea.png'
            modelUrl={'/assets/models/banker_lamp.glb'}
            position={[3, 0, 3]}
            rotationY={0}
            scale={[1, 1, 1]}
          />
          <FurnitureModel
            roomBoundary={roomBoundary}
            id='아아디2'
            name='f_테이블'
            thumbnailUrl='/assets/models/ikea.png'
            modelUrl={'/assets/models/table.glb'}
            position={[3, 0, 1]}
            rotationY={0}
            scale={[0.01, 0.01, 0.01]}
          />
          <Lighting />
          <CameraController width={roomWidth} height={roomHeight} />
        </Suspense>
      </Canvas>
    </div>
  );
}
