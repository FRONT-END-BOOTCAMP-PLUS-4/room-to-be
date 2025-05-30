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

interface WallInfo {
  id: string;
  rotationY: number;
}

// 회전 각도 비교 시 허용되는 오차의 범위
const ROTATION_EPSILON = 0.01;

const getWallIdFromRotation = (rotationY: number): string | null => {
  if (Math.abs(rotationY - Math.PI) < ROTATION_EPSILON) return 'front';
  if (Math.abs(rotationY - 0) < ROTATION_EPSILON) return 'back';
  if (Math.abs(rotationY - Math.PI / 2) < ROTATION_EPSILON) return 'left';
  if (Math.abs(rotationY + Math.PI / 2) < ROTATION_EPSILON) return 'right';
  return null;
};

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

  // 벽 위치에 따른 좌표 제한
  const constrainToWall = useCallback(
    (wall: WallInfo, position: Vector3) => {
      const constrainedPos = position.clone();
      const wallThickness = 0.1;

      const yMin = roomBoundary.yMin + wallThickness;
      const yMax = roomBoundary.yMax - halfHeight * 2;
      const yRange = Math.min(yMax, Math.max(yMin, constrainedPos.y));

      switch (wall.id) {
        case 'front':
          constrainedPos.x = Math.min(
            roomBoundary.xMax - halfWidth - wallThickness,
            Math.max(
              roomBoundary.xMin + halfWidth + wallThickness,
              constrainedPos.x,
            ), 
          );
          constrainedPos.y = yRange;
          constrainedPos.z = roomBoundary.zMax - wallThickness / 2 - halfDepth;
          break;

        case 'back':
          constrainedPos.x = Math.min(
            roomBoundary.xMax - halfWidth - wallThickness, 
            Math.max(
              roomBoundary.xMin + halfWidth + wallThickness,
              constrainedPos.x,
            ), 
          );
          constrainedPos.y = yRange;
          constrainedPos.z = roomBoundary.zMin + wallThickness / 2;
          break;

        case 'left':
          constrainedPos.x = roomBoundary.xMin + wallThickness / 2 + halfDepth;
          constrainedPos.y = yRange;
          constrainedPos.z = Math.min(
            roomBoundary.zMax - halfWidth - wallThickness,
            Math.max(
              roomBoundary.zMin + halfWidth + wallThickness,
              constrainedPos.z,
            ),
          );
          break;

        case 'right':
          constrainedPos.x = roomBoundary.xMax - wallThickness / 2 - halfDepth;
          constrainedPos.y = yRange;
          constrainedPos.z = Math.min(
            roomBoundary.zMax - halfWidth - wallThickness,
            Math.max(
              roomBoundary.zMin + halfWidth + wallThickness,
              constrainedPos.z,
            ),
          );
          break;
      }

      return constrainedPos;
    },
    [roomBoundary, halfWidth, halfHeight, halfDepth],
  );

  /**
   * 현재 이동 중인 가구와 다른 가구 간의 충돌 체크 및 위치 조정
   */
  const handleCollision = useCallback(
    (newPos: Vector3, prevPos: Vector3, wallInfo?: WallInfo): Vector3 => {
      if (!meshRef.current) return newPos;

      const currentFurniture = furnitures.find(
        (f) => f.id === currentFurnitureId,
      );
      if (!currentFurniture) return newPos;

      let adjustedPosition = newPos.clone();

      // 벽 가구인 경우 벽 제약 조건 먼저 적용
      if (placementType === 'wall' && wallInfo) {
        adjustedPosition = constrainToWall(wallInfo, adjustedPosition);
      }

      const movingBoundingBox = createBoundingBox(
        currentFurniture,
        undefined,
        adjustedPosition,
      );
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
          } else if (placementType === 'wall' && wallInfo) {
            // 벽 가구인 경우 벽 제약 조건 재적용
            adjustedPosition = constrainToWall(wallInfo, adjustedPosition);
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
      constrainToWall,
    ],
  );

  // 가구 이동 종료 시 최종 위치 충돌 체크 및 경계에 맞춰 위치 조정
  const checkFinalPosition = useCallback(
    (finalPos: Vector3, rotationY?: number): Vector3 => {
      const currentFurniture = furnitures.find(
        (f) => f.id === currentFurnitureId,
      );
      if (!currentFurniture || !meshRef.current) return finalPos;

      let adjusted = finalPos.clone();

      // 벽 가구인 경우 벽 제약 조건 적용
      if (placementType === 'wall' && rotationY !== undefined) {
        const wallId = getWallIdFromRotation(rotationY);
        if (wallId) {
          const wallInfo: WallInfo = { id: wallId, rotationY };
          adjusted = constrainToWall(wallInfo, adjusted);
        }
      }

      const currentBox = createBoundingBox(
        currentFurniture,
        undefined,
        adjusted,
      );

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
            if (placementType === 'floor') {
              adjusted.x = Math.min(
                roomBoundary.xMax - halfWidth,
                Math.max(roomBoundary.xMin + halfWidth, adjusted.x),
              );
              adjusted.z = Math.min(
                roomBoundary.zMax - halfDepth,
                Math.max(roomBoundary.zMin + halfDepth, adjusted.z),
              );
            } else if (placementType === 'wall' && rotationY !== undefined) {
              const wallId = getWallIdFromRotation(rotationY);
              if (wallId) {
                const wallInfo: WallInfo = { id: wallId, rotationY };
                adjusted = constrainToWall(wallInfo, adjusted);
              }
            }

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
      placementType,
      constrainToWall,
    ],
  );

  return {
    handleCollision,
    checkFinalPosition,
    constrainToWall,
  };
}