import { useCallback } from 'react';
import { Object3D, Vector3 } from 'three';

import {
  calculateCollisionResponse,
  createBoundingBox,
  resolveCollision,
} from '@/utils/collisionUtils';

import { useFurnitureStore } from '@/stores/useFurnitureStore';

import { RoomBoundary } from '../types/furniture';

interface UseFurnitureCollisionProps {
  currentFurnitureId: string;
  meshRef: React.RefObject<Object3D>;
  placementType: string;
  roomBoundary: RoomBoundary;
  halfWidth: number;
  halfDepth: number;
  halfHeight: number;
}


 // 가구 간 충돌 처리 및 충돌 시 슬라이딩 동작 처리 훅
export default function useFurnitureCollision({
  currentFurnitureId,
  meshRef,
  placementType,
  roomBoundary,
  halfWidth,
  halfDepth,
  halfHeight,
}: UseFurnitureCollisionProps) {
  const furnitures = useFurnitureStore((state) => state.furnitures);

  /**
   * 현재 이동 중인 가구와 다른 가구 간의 충돌 체크 및 위치 조정
   */
  const handleCollision = useCallback(
    (newPos: Vector3, prevPos: Vector3): Vector3 => {
      if (!meshRef.current) return newPos;

      const currentFurniture = furnitures.find(
        (f) => f.id === currentFurnitureId,
      );
      if (!currentFurniture) return newPos;

      const movingBoundingBox = createBoundingBox(
        currentFurniture,
        undefined,
        newPos,
      );
      let adjustedPosition = newPos.clone();
      let previousPosition = prevPos.clone();

      for (const furniture of furnitures) {
        if (furniture.id === currentFurnitureId) continue;

        const staticBoundingBox = createBoundingBox(furniture);

        const { collision, slidingDirection } = calculateCollisionResponse(
          movingBoundingBox,
          staticBoundingBox,
          adjustedPosition,
          previousPosition,
        );

        if (collision && slidingDirection) {
          // 충돌한 가구의 테두리에 맞춰 위치 조정
          adjustedPosition = resolveCollision(
            movingBoundingBox,
            staticBoundingBox,
            adjustedPosition,
            previousPosition,
            slidingDirection,
          );

          // 방 경계 처리
          if (placementType === 'floor') {
            adjustedPosition.x = Math.min(
              roomBoundary.xMax - halfWidth,
              Math.max(roomBoundary.xMin + halfWidth, adjustedPosition.x),
            );
            adjustedPosition.z = Math.min(
              roomBoundary.zMax - halfDepth,
              Math.max(roomBoundary.zMin + halfDepth, adjustedPosition.z),
            );
          } else if (placementType === 'wall') {
            adjustedPosition.x = Math.min(
              roomBoundary.xMax - halfWidth,
              Math.max(roomBoundary.xMin + halfWidth, adjustedPosition.x),
            );
            adjustedPosition.y = Math.min(
              roomBoundary.yMax - halfHeight * 2,
              Math.max(roomBoundary.yMin, adjustedPosition.y),
            );
          }

          // 새로운 경계 상자로 갱신
          movingBoundingBox.setFromCenterAndSize(
            adjustedPosition,
            new Vector3(halfWidth * 2, halfHeight * 2, halfDepth * 2),
          );
          previousPosition = adjustedPosition.clone();
        }
      }

      return adjustedPosition;
    },
    [
      currentFurnitureId,
      furnitures,
      halfDepth,
      halfHeight,
      halfWidth,
      meshRef,
      placementType,
      roomBoundary,
    ],
  );


  // 가구 이동 종료 시 최종 위치 충돌 체크 및 경계에 맞춰 위치 조정

  const checkFinalPosition = useCallback(
    (finalPos: Vector3): Vector3 => {
      const currentFurniture = furnitures.find(
        (f) => f.id === currentFurnitureId,
      );
      if (!currentFurniture || !meshRef.current) return finalPos;

      const currentBox = createBoundingBox(
        currentFurniture,
        undefined,
        finalPos,
      );
      let adjusted = finalPos.clone();

      for (const furniture of furnitures) {
        if (furniture.id === currentFurnitureId) continue;

        const otherBox = createBoundingBox(furniture);

        if (currentBox.intersectsBox(otherBox)) {
          // 이전 위치가 아닌, 충돌한 가구의 테두리에 붙이기 위해 resolveCollision 호출
          const prevPos = meshRef.current.position.clone();

          const { slidingDirection } = calculateCollisionResponse(
            currentBox,
            otherBox,
            adjusted,
            prevPos,
          );

          if (slidingDirection) {
            adjusted = resolveCollision(
              currentBox,
              otherBox,
              adjusted,
              prevPos,
              slidingDirection,
            );

            // 경계 처리
            adjusted.x = Math.min(
              roomBoundary.xMax - halfWidth,
              Math.max(roomBoundary.xMin + halfWidth, adjusted.x),
            );
            adjusted.z = Math.min(
              roomBoundary.zMax - halfDepth,
              Math.max(roomBoundary.zMin + halfDepth, adjusted.z),
            );

            currentBox.setFromCenterAndSize(
              adjusted,
              new Vector3(halfWidth * 2, halfHeight * 2, halfDepth * 2),
            );
          }
        }
      }

      return adjusted;
    },
    [
      currentFurnitureId,
      furnitures,
      meshRef,
      roomBoundary,
      halfWidth,
      halfDepth,
      halfHeight,
    ],
  );

  return {
    handleCollision,
    checkFinalPosition,
  };
}
