'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';

import Room from './components/room/Room';
import Lighting from './components/room/Lighting';
import CameraController from './components/room/CameraController';
import CameraButtons from './components/room/CameraButtons';
import CenterMarker from './components/room/CenterMaker';

import { useFurnitureStore } from '@/stores/useFurnitureStore';

export default function SimulatorPage() {
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
            width={4}
            height={4}
            wallTexture='/assets/images/testwall.jpg'
            floorTexture='/assets/images/woodfloor.png'
          />

          <Lighting />
          <CameraController width={4} height={4} />
          <CenterMarker x={4 / 2} z={4 / 2} />
        </Suspense>
      </Canvas>
    </div>
  );
}
