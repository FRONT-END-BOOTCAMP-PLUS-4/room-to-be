import { useCallback, useEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Object3D, Plane, Raycaster, Vector2, Vector3 } from 'three';

import { useFurnitureStore } from '@/stores/useFurnitureStore';
import { useViewStore } from '@/stores/useViewStore';

import { RoomBoundary } from '../types/furniture';
import useFurnitureCollision from './useFurnitureCollision';

interface DragOptions {
  halfWidth?: number;
  halfDepth?: number;
  halfHeight?: number;
  onDragEnd?: (
    position: { x: number; y: number; z: number },
    rotation?: { y: number },
  ) => void;
}

interface WallInfo {
  id: string;
  normal: Vector3;
  position: Vector3;
  plane: Plane;
  rotationY: number;
}

// 회전 각도 비교 시 허용되는 오차의 범위
const ROTATION_EPSILON = 0.01;

// 현재 뷰 각도와 topview 여부에 따라 보이지 않는 벽 이름 반환
const getHiddenWalls = (angle: number, isTopView: boolean): string[] => {
  if (isTopView) return ['front', 'right', 'back', 'left'];

  const hideWallsByAngle: Record<number, string[]> = {
    45: ['front', 'right'],
    135: ['right', 'back'],
    225: ['back', 'left'],
    315: ['left', 'front'],
  };
  return hideWallsByAngle[angle] ?? [];
};

const getWallIdFromRotation = (rotationY: number): string | null => {
  if (Math.abs(rotationY - Math.PI) < ROTATION_EPSILON) return 'front';
  if (Math.abs(rotationY - 0) < ROTATION_EPSILON) return 'back';
  if (Math.abs(rotationY - Math.PI / 2) < ROTATION_EPSILON) return 'left';
  if (Math.abs(rotationY + Math.PI / 2) < ROTATION_EPSILON) return 'right';
  return null;
};

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
  const floorPlane = useRef(new Plane(new Vector3(0, 1, 0), 0));
  const mouse = useRef(new Vector2());
  const offset = useRef(new Vector3());
  const intersectPoint = new Vector3();

  const [isDragging, setInternalDragging] = useState(false);

  const {
    halfWidth = 0,
    halfDepth = 0,
    halfHeight = 0,
    onDragEnd,
  } = options || {};

  const selectedFurnitureId = useFurnitureStore.getState().selectedFurnitureId;
  const angle = useViewStore((s) => s.angle);
  const isTopView = useViewStore((s) => s.isTopView);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    if (placementType === 'floor') {
      // 바닥에 놓인 가구는 항상 보이게
      mesh.visible = true;
    } else if (placementType === 'wall') {
      const hiddenWallIds = getHiddenWalls(angle, isTopView);

      if (isTopView) {
        // 탑뷰일 땐 벽에 붙은 가구는 모두 안 보이게
        mesh.visible = false;
      } else {
        const wallId = getWallIdFromRotation(mesh.rotation.y);
        if (wallId && hiddenWallIds.includes(wallId)) {
          mesh.visible = false;
        } else {
          mesh.visible = true;
        }
      }
    }
  }, [angle, isTopView, placementType, meshRef]);

  // 충돌 처리 훅 사용
  const { handleCollision, checkFinalPosition } = useFurnitureCollision({
    currentFurnitureId: selectedFurnitureId!,
    meshRef,
    placementType,
    roomBoundary,
    halfWidth,
    halfDepth,
    halfHeight,
  });

  // 현재 보이는 벽들 계산
  const getVisibleWalls = useCallback(() => {
    const hiddenWalls = getHiddenWalls(angle, isTopView);

    const allWalls: WallInfo[] = [
      {
        id: 'front',
        normal: new Vector3(0, 0, 1),
        position: new Vector3(roomBoundary.xMax / 2, 0, roomBoundary.zMax),
        plane: new Plane(new Vector3(0, 0, 1), -roomBoundary.zMax),
        rotationY: Math.PI,
      },
      {
        id: 'back',
        normal: new Vector3(0, 0, 1),
        position: new Vector3(roomBoundary.xMax / 2, 0, roomBoundary.zMin),
        plane: new Plane(new Vector3(0, 0, 1), -roomBoundary.zMin),
        rotationY: 0,
      },
      {
        id: 'left',
        normal: new Vector3(1, 0, 0),
        position: new Vector3(roomBoundary.xMin, 0, roomBoundary.zMax / 2),
        plane: new Plane(new Vector3(1, 0, 0), -roomBoundary.xMin),
        rotationY: Math.PI / 2,
      },
      {
        id: 'right',
        normal: new Vector3(-1, 0, 0),
        position: new Vector3(roomBoundary.xMax, 0, roomBoundary.zMax / 2),
        plane: new Plane(new Vector3(-1, 0, 0), roomBoundary.xMax),
        rotationY: -Math.PI / 2,
      },
    ];

    return allWalls.filter((wall) => !hiddenWalls.includes(wall.id));
  }, [angle, isTopView, roomBoundary]);

  // 벽과의 교차점 찾기
  const getWallIntersections = useCallback(
    (event: PointerEvent | MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);

      const intersections: Array<{
        wall: WallInfo;
        point: Vector3;
        distance: number;
      }> = [];

      for (const wall of getVisibleWalls()) {
        const intersect = raycaster.current.ray.intersectPlane(
          wall.plane,
          new Vector3(),
        );
        if (intersect) {
          const distance = intersect.distanceTo(camera.position);
          intersections.push({ wall, point: intersect, distance });
        }
      }

      // 가장 가까운 교차점 반환
      if (intersections.length > 0) {
        intersections.sort((a, b) => a.distance - b.distance);
        return intersections[0];
      }

      return null;
    },
    [camera, gl.domElement, getVisibleWalls],
  );

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
        floorPlane.current.set(new Vector3(0, 1, 0), -roomBoundary.yMin); // 바닥 평면
        const intersect = raycaster.current.ray.intersectPlane(
          floorPlane.current,
          intersectPoint,
        );
        return intersect ? { point: intersect.clone(), wall: null } : null;
      } else if (placementType === 'wall') {
        return getWallIntersections(event);
      }

      return null;
    },
    [
      camera,
      gl.domElement,
      placementType,
      roomBoundary.yMin,
      getWallIntersections,
    ],
  );

  // 가구를 클릭했을 때,
  const handlePointerDown = useCallback(
    (event: PointerEvent) => {
      event.stopPropagation();
      // 현재 마우스 위치 계산
      const intersect = getPlaneIntersection(event);
      if (intersect && meshRef.current) {
        // 가구 위치와 마우스 위치 사이의 offset 저장
        offset.current.subVectors(meshRef.current.position, intersect.point);
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
        const newPos = new Vector3().addVectors(
          intersect.point,
          offset.current,
        );

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

          // 충돌 처리 및 슬라이딩 위치 적용
          const prevPos = meshRef.current.position.clone();
          const adjusted = handleCollision(newPos, prevPos);
          meshRef.current.position.copy(adjusted);
        } else if (placementType === 'wall' && intersect.wall) {
          // [wall] 벽 위 이동: 충돌 처리 훅에서 벽 제약 조건도 처리
          const prevPos = meshRef.current.position.clone();
          const wallInfo = { id: intersect.wall.id, rotationY: intersect.wall.rotationY };
          const adjusted = handleCollision(newPos, prevPos, wallInfo);
          
          meshRef.current.position.copy(adjusted);
          meshRef.current.rotation.y = intersect.wall.rotationY;
        }
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
      handleCollision,
    ],
  );

  // 마우스를 뺐을 때,
  const handlePointerUp = useCallback(() => {
    if (isDragging) {
      setInternalDragging(false);
      setDragging?.(false);

      if (meshRef.current && onDragEnd) {
        let final = meshRef.current.position.clone();
        let finalRotation = meshRef.current.rotation.y;

        if (placementType === 'floor') {
          // 마우스 놓을 때 충돌 정리 후 최종 위치 확정
          final = checkFinalPosition(final);
          meshRef.current.position.copy(final);
        } else if (placementType === 'wall') {
          final = checkFinalPosition(final, finalRotation);
          meshRef.current.position.copy(final);
        }

        onDragEnd({ x: final.x, y: final.y, z: final.z }, { y: finalRotation });
      }
    }
  }, [
    isDragging,
    setDragging,
    onDragEnd,
    meshRef,
    checkFinalPosition,
    placementType,
  ]);

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