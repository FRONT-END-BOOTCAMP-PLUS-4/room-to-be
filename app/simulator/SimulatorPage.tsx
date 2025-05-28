'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { fetchFurnitureByPlacementType } from '@/apis/furnitures';
import { getRoomById } from '@/apis/rooms';
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

interface SimulatorPageProps {
  mode: 'create' | 'edit';
  roomId?: string;
}
export default function SimulatorPage({ mode, roomId }: SimulatorPageProps) {
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
  const [hasLoaded, setHasLoaded] = useState(false);
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

  const furnitures = useFurnitureStore((state) => state.furnitures ?? []);
  const renderableFurnitureIds = useFurnitureStore(
    (state) => state.renderableFurnitureIds,
  );
  const cameraDistance = Math.max(roomWidth, roomHeight) * 1.4;

  const handleSaveClick = () => {
    if (mode === 'create') {
      setIsSaveModalOpen(true); // 저장 모달 띄우기
      // } else {
      //   handleDirectUpdate(); // 바로 수정 저장
      // }
    }
  };
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

  useEffect(() => {
    if (mode === 'edit' && roomId && !hasLoaded) {
      const load = async () => {
        try {
          const room = await getRoomById(roomId);
          const validFurnitures = (room.furnitures ?? []).map((f) => ({
            id: f.id,
            furnitureId: f.furnitureId,
            name: f.name,
            category: f.category,
            modelUrl: f.modelUrl,
            thumbnailUrl: f.thumbnailUrl,
            placementType: f.placementType,
            positionX: f.positionX,
            positionY: f.positionY,
            positionZ: f.positionZ,
            rotationY: f.rotationY,
            scaleX: f.scaleX,
            scaleY: f.scaleY,
            scaleZ: f.scaleZ,
          }));
          useRoomSizeStore
            .getState()
            .setDimensions(room.roomWidth, room.roomHeight, 2.5);

          useFurnitureStore.getState().clearFurnitures();
          useFurnitureStore.getState().setFurnitures(validFurnitures);
          useFurnitureStore
            .getState()
            .setRenderableIds(validFurnitures.map((f) => f.id));
        } catch (e) {
          console.error('방 불러오기 실패:', e);
          alert('방 데이터를 불러오는 데 실패했습니다.');
        }
        setHasLoaded(true);
      };

      load();
    }
  }, [mode, roomId, hasLoaded]);

  const roomComponent = useMemo(() => {
    if (isNaN(roomWidth) || isNaN(roomHeight)) return null;
    return (
      <Room
        width={roomWidth}
        height={roomHeight}
        wallTexture='/assets/images/testwall.jpg'
        floorTexture='/assets/images/woodfloor.png'
        floorExtension={floorExtension}
      />
    );
  }, [roomWidth, roomHeight]);
  return (
    <div className='relative w-full h-screen overflow-hidden'>
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
            {(furnitures ?? [])
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

      <div className='absolute top-[50px] right-[70px] z-30'>
        <BackgroundSelector />
      </div>
      <div className='absolute top-[140px] right-[70px] z-30'>
        <FurnitureController />
      </div>

      <div className='absolute top-[20px] right-[20px] z-30 flex gap-2'>
        <Button onClick={handleSaveClick}>저장하기</Button>
        <Button variant='secondary' onClick={() => history.back()}>
          나가기
        </Button>
      </div>

      {isSaveModalOpen && (
        <>
          <RoomSaveModal
            onClose={() => setIsSaveModalOpen(false)}
            canvasRef={captureCanvasRef}
            furnitures={furnitures}
            width={roomWidth}
            height={roomHeight}
            userId={'2'}
          />
          <div className='absolute top-0 left-0 w-full h-full opacity-0 pointer-events-none'>
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
