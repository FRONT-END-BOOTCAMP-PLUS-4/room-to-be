'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';

import Room from './components/room/Room';
import Lighting from './components/room/Lighting';
import CameraController from './components/room/CameraController';
import CameraButtons from './components/room/CameraButtons';

import { useFurnitureStore } from '@/stores/useFurnitureStore';
import FurnitureModel from './components/furnitures/FurnitureModel';

export default function SimulatorPage() {
  const roomWidth = 4;
  const roomHeight = 4;

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
      <CameraButtons />

      <Canvas
        shadows
        camera={{ position: [5, 5, 5], fov: 50 }}
        className='w-full h-full'
        onPointerMissed={() => {
          useFurnitureStore.getState().clearSelection();
        }}
      >
        <Suspense fallback={null}>
          <Room
            // 여기서 width, height는 미터단위고 처음 입력값 받아서 넘겨오기
            width={roomWidth}
            height={roomHeight}
            wallTexture='/assets/images/testwall.jpg'
            floorTexture='/assets/images/woodfloor.png'
          />
          <FurnitureModel
            roomBoundary={roomBoundary}
            id='아아디'
            name='f_이케아 트롤리'
            thumbnailUrl='/assets/models/ikea.png'
            modelUrl={'/assets/models/ikea_cart.glb'}
            position={[2, 0.5, 2]}
            rotationY={0}
            scale={0.01}
          />
          <FurnitureModel
            roomBoundary={roomBoundary}
            id='아이디3'
            name='f_이케아 트롤리2'
            thumbnailUrl='/assets/models/ikea.png'
            modelUrl={'/assets/models/ikea_cart.glb'}
            position={[3, 0.5, 3]}
            rotationY={0}
            scale={0.01}
          />
          <FurnitureModel
            roomBoundary={roomBoundary}
            id='아아디2'
            name='f_테이블'
            thumbnailUrl='/assets/models/ikea.png'
            modelUrl={'/assets/models/table.glb'}
            position={[4, 0.5, 1]}
            rotationY={0}
            scale={0.01}
          />
          <Lighting />
          <CameraController width={roomWidth} height={roomHeight} />
        </Suspense>
      </Canvas>
    </div>
  );
}
