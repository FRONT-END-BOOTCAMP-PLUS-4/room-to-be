import { useRef, useEffect, useCallback, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Vector2, Vector3, Raycaster, Plane, Object3D } from 'three';

interface RoomBoundary {
  xMin: number;
  xMax: number;
  zMin: number;
  zMax: number;
  yFloor: number;
}

// 마우스 이벤트에 따라 가구 position 변경하는 훅
export default function useDragPosition(
  meshRef: React.RefObject<Object3D>,
  roomBoundary: RoomBoundary,
  setDragging?: (value: boolean) => void,
) {
  const { gl, camera } = useThree();
  const raycaster = useRef(new Raycaster());
  const plane = useRef(new Plane(new Vector3(0, 1, 0), 0));
  const mouse = useRef(new Vector2());
  const offset = useRef(new Vector3());
  const intersectPoint = new Vector3();

  const [isDragging, setInternalDragging] = useState(false);

  const getPlaneIntersection = useCallback(
    (event: PointerEvent | MouseEvent) => {
      // 캔버스 위치와 크기
      const rect = gl.domElement.getBoundingClientRect();

      // 마우스 좌표를 WebGL상의 좌표로 변경
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // 카메라에서 마우스 방향으로 레이
      raycaster.current.setFromCamera(mouse.current, camera);
      // 레이와 바닥의 교차점 계산해서 반환
      const intersect = raycaster.current.ray.intersectPlane(plane.current, intersectPoint);
      return intersect ? intersect.clone() : null;
    },
    [camera, gl.domElement],
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
      // 현재 마우스 위치 계산
      const intersect = getPlaneIntersection(event);
      if (intersect) {
        // 새로운 가구 위치 계산
        const newPos = new Vector3().addVectors(intersect, offset.current);
        newPos.x = Math.min(roomBoundary.xMax, Math.max(roomBoundary.xMin, newPos.x));
        newPos.z = Math.min(roomBoundary.zMax, Math.max(roomBoundary.zMin, newPos.z));
        newPos.y = roomBoundary.yFloor;
        meshRef.current.position.copy(newPos);
      }
    },
    [getPlaneIntersection, meshRef, roomBoundary, isDragging],
  );

  // 마우스를 뗐을 때,
  const handlePointerUp = useCallback(() => {
    if (isDragging) {
      setInternalDragging(false);
      setDragging?.(false);
    }
  }, [isDragging, setDragging]);

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