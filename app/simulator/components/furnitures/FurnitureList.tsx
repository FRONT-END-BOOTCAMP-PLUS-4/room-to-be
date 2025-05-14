'use client';

import { useEffect, useState } from 'react';
import FurnitureModel from './FurnitureModel';

interface PlacedFurniture {
  id: string;
  name: string;
  furnitureId: string;
  modelUrl: string;
  thumbnailUrl: string;
  positionX: number;
  positionY: number;
  positionZ: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  rotationY: number;
  scale: number;
}

interface Props {
  roomId: string;
}

export default function FurnitureList({ roomId }: Props) {
  const [placedFurnitures, setPlacedFurnitures] = useState<PlacedFurniture[]>(
    [],
  );
  // 오류 방지 임시 값
  const roomBoundary = {
    xMin: 0,
    xMax: 4,
    zMin: 0,
    zMax: 4,
    yFloor: 0,
    yWall: 2.5,
  };

  useEffect(() => {
    async function fetchPlacedFurnitures() {
      try {
        // TODO : 가구 정보 받아오는 api 연동 필요, 방 크기도 받아와야 함
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
          roomBoundary={roomBoundary}
          key={furniture.id}
          id={furniture.id}
          name={furniture.name}
          thumbnailUrl={furniture.thumbnailUrl}
          modelUrl={furniture.modelUrl}
          position={[
            furniture.positionX,
            furniture.positionY,
            furniture.positionZ,
          ]}
          rotationY={furniture.rotationY}
          scale={[furniture.scaleX, furniture.scaleY, furniture.scaleZ]}
        />
      ))}
    </>
  );
}
