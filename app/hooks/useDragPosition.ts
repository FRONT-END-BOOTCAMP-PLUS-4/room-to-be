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
    const hideWallsByAngle: Record<number, string[]> = {
      45: ['front', 'right'],
      135: ['right', 'back'],
      225: ['back', 'left'],
      315: ['left', 'front'],
    };

    let hiddenWalls: string[] = [];
    if (isTopView) {
      hiddenWalls = ['front', 'right', 'back', 'left'];
    } else {
      hiddenWalls = hideWallsByAngle[angle] ?? [];
    }

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

      console.log(
        '👁️ Visible Walls:',
        getVisibleWalls().map((w) => w.id),
      );

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
        console.log('🎯 Mouse intersects wall:', intersections[0].wall.id);
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
          // [wall] 벽 위 이동: 해당 벽에 맞게 위치 제한
          const constrainedPos = constrainToWall(intersect.wall, newPos);
          meshRef.current.position.copy(constrainedPos);

          // 벽에 맞게 회전 적용
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
      halfHeight,
      handleCollision,
      constrainToWall,
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
