'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { fetchFurnitureByPlacementType } from '@/apis/furnitures';
import { useFurnitureStore } from '@/stores/useFurnitureStore';
import { useLoadingStore } from '@/stores/useLoadingStore';
import { useRoomSizeStore } from '@/stores/useRoomSizeStore';

import CaptureCanvas from './components/capture/CaptureCanvas';
import FurnitureController from './components/furnitures/FurnitureController';
import FurnitureModel from './components/furnitures/FurnitureModel';
import BackgroundController from './components/room/BackgroundController';
import BackgroundSelector from './components/room/BackgroundSelector';
import CameraController from './components/room/CameraController';
import Lighting from './components/room/Lighting';
import Room from './components/room/Room';
import RoomSaveModal from './components/room/RoomSaveModal';
import FurnitureSidebar from './components/sidebar/FurnitureSidebar';

export default function SimulatorPage() {
  const { setLoading } = useLoadingStore();
  const [canvasCreated, setCanvasCreated] = useState(false);
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const captureCanvasRef = useRef<HTMLCanvasElement>(null);

  const {
    width: storeWidth,
    height: storeHeight,
    wallHeight: storeWallHeight,
  } = useRoomSizeStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const roomWidth = storeWidth;
  const roomHeight = storeHeight;
  const floorExtension = 0.1;
  const wallExtension = 0.1;

  const extendedWidth = roomWidth + wallExtension * 2;
  const extendedHeight = roomHeight + wallExtension * 2;

  const roomBoundary = useMemo(
    () => ({
      xMin: wallExtension,
      xMax: extendedWidth - wallExtension,
      zMin: wallExtension,
      zMax: extendedHeight - wallExtension,
      yMin: 0,
      yMax: storeWallHeight || 2.5,
    }),
    [extendedWidth, extendedHeight, storeWallHeight],
  );

  const furnitures = useFurnitureStore((state) => state.furnitures);
  const renderableFurnitureIds = useFurnitureStore(
    (state) => state.renderableFurnitureIds,
  );
  const cameraDistance = Math.max(roomWidth, roomHeight) * 1.4;

  const roomComponent = useMemo(
    () => (
      <Room
        width={roomWidth}
        height={roomHeight}
        wallTexture='/assets/images/testwall.jpg'
        floorTexture='/assets/images/woodfloor.png'
        floorExtension={floorExtension}
      />
    ),
    [roomWidth, roomHeight],
  );
  useEffect(() => {
    if (canvasCreated) {
      const timer = setTimeout(() => {
        setSceneLoaded(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [canvasCreated]);

  useEffect(() => {
    if (canvasCreated && sceneLoaded) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [canvasCreated, sceneLoaded, setLoading]);

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
          onCreated={() => {
            setCanvasCreated(true);
          }}
        >
          <Suspense fallback={null}>
            <BackgroundController />
            {roomComponent}
          </Suspense>
          <Suspense fallback={null}>
            {furnitures
              .filter((f) => renderableFurnitureIds.includes(f.id))
              .map((furniture) => (
                <FurnitureModel
                  key={furniture.id}
                  roomBoundary={roomBoundary}
                  {...furniture}
                />
              ))}
          </Suspense>
          <Lighting />
          <CameraController width={roomWidth} height={roomHeight} />
        </Canvas>
      </div>

      {/* 사이드바 */}
      <div
        className={`
          absolute top-0 left-0 z-30 w-80 h-full
          ${isSidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'}
        `}
      >
        <FurnitureSidebar
          fetchFurnitureByPlacementType={fetchFurnitureByPlacementType}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
      </div>

      {/* 사이드바 토글 버튼 */}
      <Button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        variant='ghost'
        size='icon'
        className={`
          absolute top-1/2 z-40 -translate-y-1/2 transition-all
          ${isSidebarOpen ? 'left-[320px]' : 'left-2'}
          bg-white/20 backdrop-blur-sm text-white
          border border-white/30 shadow-md hover:bg-white/30
          rounded-full w-8 h-8
        `}
      >
        {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </Button>

      {/* 오른쪽 UI */}
      <div className='absolute top-[50px] right-[70px] z-30'>
        <BackgroundSelector />
      </div>
      <div className='absolute top-[140px] right-[70px] z-30'>
        <FurnitureController />
      </div>

      {/* 저장/나가기 버튼 UI */}
      <div className='absolute top-[20px] right-[20px] z-30 flex gap-2'>
        <Button onClick={() => setIsSaveModalOpen(true)}>저장하기</Button>
        <Button variant='secondary' onClick={() => history.back()}>
          나가기
        </Button>
      </div>

      {/* 저장 모달 & 캡처 캔버스 (조건부 렌더) */}
      {isSaveModalOpen && (
        <>
          <RoomSaveModal
            onClose={() => setIsSaveModalOpen(false)}
            canvasRef={captureCanvasRef} // ✅ 캡처용 ref 전달
            furnitures={furnitures}
            width={roomWidth}
            height={roomHeight}
            userId={'2'}
          />
          <div className='hidden'>
            <CaptureCanvas
              ref={captureCanvasRef}
              furnitures={furnitures}
              width={roomWidth}
              height={roomHeight}
              wallHeight={storeWallHeight}
            />
          </div>
        </>
      )}
    </div>
  );
}
