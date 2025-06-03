'use client';

import { useState } from 'react';
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

import { useFurnitureStore } from '@/stores/useFurnitureStore';
import { useRoomSizeStore } from '@/stores/useRoomSizeStore';

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
  const { isCreating, setIsCreating, furnitures } = useFurnitureStore();
  const { width: roomWidth, height: roomHeight } = useRoomSizeStore();
  const [showDialog, setShowDialog] = useState(false);

  const findAvailablePosition = async (): Promise<{
    x: number;
    y: number;
    z: number;
    rotY: number;
  } | null> => {
    const isWall = item.placementType === 'wall';
    //임시 중앙 생성
    if (isWall) {
      return {
        x: roomWidth / 2,
        y: 1.2,
        z: roomHeight / 2,
        rotY: Math.PI,
      };
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
    if (isCreating) return;
    setIsCreating(true);

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
      setIsCreating(false);
    }
  };

  return (
    <>
      <div
        className='bg-white rounded-md overflow-hidden aspect-square cursor-pointer'
        onClick={handleClick}
      >
        <img
          src={item.thumbnailUrl}
          alt={item.name}
          className='object-cover w-full h-full'
        />
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
