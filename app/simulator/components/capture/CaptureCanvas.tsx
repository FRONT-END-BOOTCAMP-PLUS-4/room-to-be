'use client';

import { forwardRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';

import FurnitureModel from '../furnitures/FurnitureModel';
import BackgroundBackground from '../room/BackgroundController';
import CameraController from '../room/CameraController';
import Lighting from '../room/Lighting';
import Room from '../room/Room';

interface CaptureCanvasProps {
  furnitures: any[];
  width: number;
  height: number;
  wallHeight: number;
}

const CaptureCanvas = forwardRef<HTMLCanvasElement, CaptureCanvasProps>(
  function CaptureCanvas({ furnitures, width, height, wallHeight }, ref) {
    const roomBoundary = {
      xMin: 0,
      xMax: width,
      zMin: 0,
      zMax: height,
      yMin: 0,
      yMax: wallHeight || 2.5,
    };

    const cameraDistance = Math.max(width, height) * 1.4;

    return (
      <Canvas
        ref={ref}
        shadows
        gl={{ preserveDrawingBuffer: true }}
        camera={{
          position: [cameraDistance, cameraDistance, cameraDistance],
          fov: 50,
        }}
        style={{ width: 512, height: 512 }}
      >
        <Suspense fallback={null}>
          <BackgroundBackground />
          <Room
            width={width}
            height={height}
            wallTexture='/assets/images/testwall.jpg'
            floorTexture='/assets/images/woodfloor.png'
            floorExtension={0}
          />
          {furnitures.map((furniture) => (
            <FurnitureModel
              key={furniture.id}
              roomBoundary={roomBoundary}
              {...furniture}
            />
          ))}
          <Lighting />
          <CameraController width={width} height={height} isCaptureMode />
        </Suspense>
      </Canvas>
    );
  },
);

export default CaptureCanvas;
