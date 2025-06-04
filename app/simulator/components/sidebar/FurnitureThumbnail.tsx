'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import * as THREE from 'three';
// @ts-ignore
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { v4 as uuidv4 } from 'uuid';

import type { Furnitures } from '@/app/types/furniture';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { createBoundingBoxFromGLTF } from '@/utils/boundingBoxUtils';
import { createBoundingBox } from '@/utils/collisionUtils';
import { getHiddenWalls } from '@/utils/viewUtils';

import { cn } from '@/lib/utils';
import { useFurnitureStore } from '@/stores/useFurnitureStore';
import { useRoomSizeStore } from '@/stores/useRoomSizeStore';
import { useViewStore } from '@/stores/useViewStore';

interface Props {
  item: Furnitures;
  onSelect: (furniture: {
    id: string;
    furnitureId: string;
    name: string;
    category: string;
    thumbnailUrl: string;
    modelUrl: string;
    positionX: number;
    positionY: number;
    positionZ: number;
    rotationY: number;
    scaleX: number;
    scaleY: number;
    scaleZ: number;
    placementType: 'wall' | 'floor';
  }) => Promise<void> | void;
}

export default function FurnitureThumbnail({ item, onSelect }: Props) {
  const { furnitures } = useFurnitureStore();
  const { width: roomWidth, height: roomHeight } = useRoomSizeStore();
  const [showDialog, setShowDialog] = useState(false);
  const [isClickable, setIsClickable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const angle = useViewStore((state) => state.angle);
  const isTopView = useViewStore((state) => state.isTopView);

  const findAvailablePosition = async (): Promise<{
    x: number;
    y: number;
    z: number;
    rotY: number;
  } | null> => {
    const isWall = item.placementType === 'wall';

    if (isWall) {
      const hiddenWalls = getHiddenWalls(angle, isTopView);
      const wallY = 1.2;
      const padding = 0.2;

      if (hiddenWalls.includes('front')) {
        return {
          x: Math.random() * (roomWidth - 2 * padding) + padding, // x축 랜덤
          y: wallY,
          z: padding,
          rotY: 0,
        };
      } else if (hiddenWalls.includes('right')) {
        return {
          x: roomWidth - padding,
          y: wallY,
          z: Math.random() * (roomHeight - 2 * padding) + padding, // z축 랜덤
          rotY: -Math.PI / 2,
        };
      } else if (hiddenWalls.includes('left')) {
        return {
          x: padding,
          y: wallY,
          z: Math.random() * (roomHeight - 2 * padding) + padding, // z축 랜덤
          rotY: Math.PI / 2,
        };
      } else {
        return {
          x: Math.random() * (roomWidth - 2 * padding) + padding, // x축 랜덤
          y: wallY,
          z: roomHeight - padding,
          rotY: Math.PI,
        };
      }
    }

    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(item.modelUrl);
    const model = gltf.scene;
    model.scale.set(item.scaleX, item.scaleY, item.scaleZ);
    model.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const marginX = size.x / 2;
    const marginZ = size.z / 2;

    for (let i = 0; i < 50; i++) {
      const x = Math.random() * (roomWidth - 2 * marginX) + marginX;
      const y = 0;
      const z = Math.random() * (roomHeight - 2 * marginZ) + marginZ;
      const rotY = 0;

      model.position.set(x, y, z);
      model.rotation.y = rotY;
      model.updateMatrixWorld(true);

      const candidateBox = createBoundingBoxFromGLTF(model);

      const hasCollision = furnitures.some((f) => {
        const box = createBoundingBox(f);
        return box.intersectsBox(candidateBox);
      });

      if (!hasCollision) return { x, y, z, rotY };
    }

    return null;
  };

  const handleClick = async () => {
    if (!isClickable || isLoading) return;

    setIsClickable(false);
    setIsLoading(true);

    try {
      const found = await findAvailablePosition();
      if (!found) {
        setShowDialog(true);
        return;
      }

      await onSelect({
        id: uuidv4(),
        furnitureId: item.id,
        name: item.name,
        category: item.category,
        thumbnailUrl: item.thumbnailUrl,
        modelUrl: item.modelUrl,
        positionX: found.x,
        positionY: found.y,
        positionZ: found.z,
        rotationY: found.rotY,
        scaleX: item.scaleX,
        scaleY: item.scaleY,
        scaleZ: item.scaleZ,
        placementType: item.placementType as 'wall' | 'floor',
      });
    } catch (err) {
      console.error('모델 로딩 실패:', err);
    } finally {
      setIsClickable(true);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={cn(
          'relative rounded-md aspect-square overflow-hidden transition-all duration-200 bg-white shadow hover:shadow-md',
          'cursor-pointer active:scale-95 hover:ring-2 hover:ring-blue-400',
          !isClickable && 'pointer-events-none opacity-60',
        )}
      >
        <img
          src={item.thumbnailUrl}
          alt={item.name}
          className='object-cover w-full h-full'
        />
        {isLoading && (
          <div className='absolute inset-0 bg-white/60 flex items-center justify-center z-10'>
            <Loader2 className='w-5 h-5 animate-spin text-blue-500' />
          </div>
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>해당 위치에는 가구를 배치할 수 없습니다.</DialogTitle>
            <p className='text-sm text-muted-foreground'>
              공간이 부족하거나 다른 가구와 겹칩니다. 다른 자리를 선택해 주세요.
            </p>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
