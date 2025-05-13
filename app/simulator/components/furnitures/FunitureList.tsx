'use client';

import { useEffect, useState } from 'react';
import FurnitureModel from './FunitureModel';

interface PlacedFurniture {
  id: string;
  furniture_id: string;
  modelUrl: string;
  positionX: number;
  positionY: number;
  positionZ: number;
  rotationY: number;
  scale: number;
}

interface Props {
  roomId: string;
}

export default function PlacedFurnitureList({ roomId }: Props) {
  const [placedFurnitures, setPlacedFurnitures] = useState<PlacedFurniture[]>([]);

  useEffect(() => {
    async function fetchPlacedFurnitures() {
      try {
        // TODO : 가구 정보 받아오는 api 연동 필요
        // const res = await fetch(`/api/placed-furnitures?roomId=${roomId}`);
        // const data = await res.json();
        // setPlacedFurnitures(data);
      } catch (error) {
        console.error('가구 졍보 불러오기 실패:', error);
      }
    }

    fetchPlacedFurnitures();
  }, [roomId]);

  return (
    <>
      {placedFurnitures.map((furniture) => (
        <FurnitureModel
          key={furniture.id}
          modelUrl={furniture.modelUrl}
          position={[
            furniture.positionX,
            furniture.positionY,
            furniture.positionZ,
          ]}
          rotationY={furniture.rotationY}
          scale={furniture.scale}
        />
      ))}
    </>
  );
}
