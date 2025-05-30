import { useCallback } from 'react';
import { Object3D, Vector3 } from 'three';

import {
  createBoundingBox,
  resolveMultipleCollisions,
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
  // 정규화된 각도로 변환 (0 ~ 2π)
  const normalizedRotation = ((rotationY % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
  
  if (Math.abs(normalizedRotation - Math.PI) < ROTATION_EPSILON) return 'front';
  if (Math.abs(normalizedRotation - 0) < ROTATION_EPSILON || Math.abs(normalizedRotation - 2 * Math.PI) < ROTATION_EPSILON) return 'back';
  if (Math.abs(normalizedRotation - Math.PI / 2) < ROTATION_EPSILON) return 'left';
  if (Math.abs(normalizedRotation - 3 * Math.PI / 2) < ROTATION_EPSILON) return 'right';
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

  // 벽용 가구의 충돌 처리 (collisionUtils의 함수 활용)
  const handleWallCollision = useCallback(
    (newPos: Vector3, prevPos: Vector3, wallInfo: WallInfo): Vector3 => {
      if (!meshRef.current) return newPos;

      const currentFurniture = furnitures.find(
        (f) => f.id === currentFurnitureId,
      );
      if (!currentFurniture) return newPos;

      let adjustedPosition = newPos.clone();
      
      // 벽 제약 조건 먼저 적용
      adjustedPosition = constrainToWall(wallInfo, adjustedPosition);

      // 같은 벽에 있는 다른 벽용 가구들 필터링
      const sameWallFurnitures = furnitures.filter(furniture => {
        if (furniture.id === currentFurnitureId || furniture.placementType !== 'wall') {
          return false;
        }
        const otherWallId = getWallIdFromRotation(furniture.rotationY);
        return otherWallId === wallInfo.id;
      });

      // resolveMultipleCollisions 함수 사용 (벽용)
      const resolvedPosition = resolveMultipleCollisions(
        currentFurniture,
        createBoundingBox(currentFurniture, undefined, adjustedPosition),
        sameWallFurnitures,
        adjustedPosition,
        prevPos,
        wallInfo.id
      );

      // 벽 제약 조건 재적용
      return constrainToWall(wallInfo, resolvedPosition);
    },
    [
      currentFurnitureId,
      furnitures,
      meshRef,
      constrainToWall,
    ],
  );

  /**
   * 현재 이동 중인 가구와 다른 가구 간의 충돌 체크 및 위치 조정
   * collisionUtils의 개선된 함수들을 활용
   */
  const handleCollision = useCallback(
    (newPos: Vector3, prevPos: Vector3, wallInfo?: WallInfo): Vector3 => {
      if (!meshRef.current) return newPos;

      const currentFurniture = furnitures.find(
        (f) => f.id === currentFurnitureId,
      );
      if (!currentFurniture) return newPos;

      // 벽용 가구인 경우 별도 처리
      if (placementType === 'wall' && wallInfo) {
        return handleWallCollision(newPos, prevPos, wallInfo);
      }

      // 바닥용 가구 처리 - resolveMultipleCollisions 사용
      let adjustedPosition = newPos.clone();

      // 충돌할 수 있는 다른 가구들 (바닥용 가구는 모든 가구와 충돌 가능)
      const otherFurnitures = furnitures.filter(f => f.id !== currentFurnitureId);

      // 다중 충돌 해결
      adjustedPosition = resolveMultipleCollisions(
        currentFurniture,
        createBoundingBox(currentFurniture, undefined, adjustedPosition),
        otherFurnitures,
        adjustedPosition,
        prevPos
      );

      // 방 경계 처리
      adjustedPosition.x = Math.min(
        roomBoundary.xMax - halfWidth,
        Math.max(roomBoundary.xMin + halfWidth, adjustedPosition.x),
      );
      adjustedPosition.z = Math.min(
        roomBoundary.zMax - halfDepth,
        Math.max(roomBoundary.zMin + halfDepth, adjustedPosition.z),
      );

      return adjustedPosition;
    },
    [
      currentFurnitureId,
      furnitures,
      halfDepth,
      halfWidth,
      meshRef,
      placementType,
      roomBoundary,
      handleWallCollision,
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

      // 충돌 체크 및 해결
      if (placementType === 'wall' && rotationY !== undefined) {
        const wallId = getWallIdFromRotation(rotationY);
        if (wallId) {
          // 같은 벽에 있는 가구들과만 충돌 체크
          const sameWallFurnitures = furnitures.filter(furniture => {
            if (furniture.id === currentFurnitureId || furniture.placementType !== 'wall') {
              return false;
            }
            const otherWallId = getWallIdFromRotation(furniture.rotationY);
            return otherWallId === wallId;
          });

          adjusted = resolveMultipleCollisions(
            currentFurniture,
            createBoundingBox(currentFurniture, undefined, adjusted),
            sameWallFurnitures,
            adjusted,
            meshRef.current.position.clone(),
            wallId
          );

          // 벽 제약 조건 재적용
          const wallInfo: WallInfo = { id: wallId, rotationY };
          adjusted = constrainToWall(wallInfo, adjusted);
        }
      } else {
        // 바닥용 가구는 모든 가구와 충돌 체크
        const otherFurnitures = furnitures.filter(f => f.id !== currentFurnitureId);
        
        adjusted = resolveMultipleCollisions(
          currentFurniture,
          createBoundingBox(currentFurniture, undefined, adjusted),
          otherFurnitures,
          adjusted,
          meshRef.current.position.clone()
        );

        // 방 경계 처리
        adjusted.x = Math.min(
          roomBoundary.xMax - halfWidth,
          Math.max(roomBoundary.xMin + halfWidth, adjusted.x),
        );
        adjusted.z = Math.min(
          roomBoundary.zMax - halfDepth,
          Math.max(roomBoundary.zMin + halfDepth, adjusted.z),
        );
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