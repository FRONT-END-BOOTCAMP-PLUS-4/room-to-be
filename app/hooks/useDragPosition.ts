import { useCallback, useEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Object3D, Plane, Raycaster, Vector2, Vector3 } from 'three';

import { RoomBoundary } from '../types/furniture';

interface DragOptions {
  halfWidth?: number;
  halfDepth?: number;
  halfHeight?: number;
  onDragEnd?: (position: { x: number; y: number; z: number }) => void;
}

// 마우스 이벤트에 따라 가구 position 변경하는 훅
export default function useDragPosition(
  meshRef: React.RefObject<Object3D>,
  roomBoundary: RoomBoundary,
  placementType: string,
  setDragging?: (value: boolean) => void,
  options?: DragOptions,
) {
  const { gl, camera } = useThree();
  const raycaster = useRef(new Raycaster());
  const plane = useRef(new Plane(new Vector3(0, 1, 0), 0));
  const mouse = useRef(new Vector2());
  const offset = useRef(new Vector3());
  const intersectPoint = new Vector3();

  const [isDragging, setInternalDragging] = useState(false);

  const { halfWidth = 0, halfDepth = 0 , halfHeight = 0, onDragEnd } = options || {};

  const getPlaneIntersection = useCallback(
    (event: PointerEvent | MouseEvent) => {
      // 캔버스 위치와 크기
      const rect = gl.domElement.getBoundingClientRect();

      // 마우스 좌표를 WebGL상의 좌표로 변경
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // 카메라에서 마우스 방향으로 레이
      raycaster.current.setFromCamera(mouse.current, camera);

      // placementType에 따라 평면 설정
      if (placementType === 'floor') {
        plane.current.set(new Vector3(0, 1, 0), -roomBoundary.yMin); // 바닥 평면
      } else if (placementType === 'wall') {
        plane.current.set(new Vector3(0, 0, 1), 0); // 정면 벽면 평면 (z=0 기준)
      }

      const intersect = raycaster.current.ray.intersectPlane(
        plane.current,
        intersectPoint,
      );
      return intersect ? intersect.clone() : null;
    },
    [camera, gl.domElement, placementType, roomBoundary.yMin],
  );

  // 가구를 클릭했을 때,
  const handlePointerDown = useCallback(
    (event: PointerEvent) => {
      event.stopPropagation();
      // 현재 마우스 위치 계산
      const intersect = getPlaneIntersection(event);
      if (intersect && meshRef.current) {
        // 가구 위치와 마우스 위치 사이의 offset 저장
        offset.current.subVectors(meshRef.current.position, intersect);
        setInternalDragging(true);
        setDragging?.(true);
      }
    },
    [getPlaneIntersection, meshRef, setDragging],
  );

  // 가구를 클릭한 채로 이동 중 일때,
  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (!isDragging || !meshRef.current) return;

      const intersect = getPlaneIntersection(event);
      if (intersect) {
        // 새로운 가구 위치 계산
        const newPos = new Vector3().addVectors(intersect, offset.current);

        if (placementType === 'floor') {
          // [floor] 바닥 위 이동
          newPos.x = Math.min(
            roomBoundary.xMax - halfWidth,
            Math.max(roomBoundary.xMin + halfWidth, newPos.x),
          );
          newPos.z = Math.min(
            roomBoundary.zMax - halfDepth,
            Math.max(roomBoundary.zMin + halfDepth, newPos.z),
          );
          newPos.y = roomBoundary.yMin;
        } else if (placementType === 'wall') {
          // [wall] 벽 위 이동: x와 y만 조정, z는 벽에 고정
          newPos.x = Math.min(
            roomBoundary.xMax - halfWidth,
            Math.max(roomBoundary.xMin + halfWidth, newPos.x),
          );
          newPos.y = Math.min(
            roomBoundary.yMax - halfHeight * 2,
            Math.max(roomBoundary.yMin, newPos.y),
          );
          newPos.z = 0; // 벽면에 고정 (z = 0 벽 기준)
        }

        meshRef.current.position.copy(newPos);
      }
    },
    [
      getPlaneIntersection,
      meshRef,
      roomBoundary,
      isDragging,
      placementType,
      halfWidth,
      halfDepth,
    ],
  );

  // 마우스를 뗐을 때,
  const handlePointerUp = useCallback(() => {
    if (isDragging) {
      setInternalDragging(false);
      setDragging?.(false);

      if (meshRef.current && onDragEnd) {
      const { x, y, z } = meshRef.current.position;
      onDragEnd({ x, y, z });
    }
    }
  }, [isDragging, setDragging, options, meshRef]);

  useEffect(() => {
    // 마우스를 캔버스 밖에서 조작했을 경우 대비
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointermove', handlePointerMove);
    return () => {
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [handlePointerUp, handlePointerMove]);

  return {
    onPointerDown: handlePointerDown,
  };
}
