import { useCallback, useEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Euler, Object3D, Plane, Raycaster, Vector2, Vector3 } from 'three';
import * as THREE from 'three';

import { startFloating, stopFloating } from '@/utils/floating';
import { startShakeAnimation, stopShakeAnimation } from '@/utils/shake';

import { useFurnitureStore } from '@/stores/useFurnitureStore';
import { useViewStore } from '@/stores/useViewStore';

import { RoomBoundary } from '../types/furniture';
import useFurnitureCollision from './useFurnitureCollision';

interface DragOptions {
  halfWidth?: number;
  halfDepth?: number;
  halfHeight?: number;
  onDrag?: (pos: THREE.Vector3, rot?: THREE.Euler) => void;
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

const ROTATION_EPSILON = 0.01;

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
      mesh.visible = true;
    } else if (placementType === 'wall') {
      const hiddenWallIds = getHiddenWalls(angle, isTopView);
      if (isTopView) {
        mesh.visible = false;
      } else {
        const wallId = getWallIdFromRotation(mesh.rotation.y);
        mesh.visible = !(wallId && hiddenWallIds.includes(wallId));
      }
    }
  }, [angle, isTopView, placementType, meshRef]);

  const { handleCollision, checkFinalPosition } = useFurnitureCollision({
    currentFurnitureId: selectedFurnitureId!,
    meshRef,
    placementType,
    roomBoundary,
    halfWidth,
    halfDepth,
    halfHeight,
  });

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
      const rect = gl.domElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.current.setFromCamera(mouse.current, camera);
      if (placementType === 'floor') {
        floorPlane.current.set(new Vector3(0, 1, 0), -roomBoundary.yMin);
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

  const handlePointerDown = useCallback(
    (event: PointerEvent) => {
      event.stopPropagation();
      const intersect = getPlaneIntersection(event);
      if (intersect && meshRef.current) {
        offset.current.subVectors(meshRef.current.position, intersect.point);
        setInternalDragging(true);
        setDragging?.(true);

        if (placementType === 'floor') {
          startFloating(meshRef.current); // 바닥에만 floating 애니메이션 적용
        }
      }
    },
    [getPlaneIntersection, meshRef, setDragging],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (!isDragging || !meshRef.current) return;
      const intersect = getPlaneIntersection(event);
      if (intersect) {
        const newPos = new Vector3().addVectors(
          intersect.point,
          offset.current,
        );
        if (placementType === 'floor') {
          newPos.x = Math.min(
            roomBoundary.xMax - halfWidth,
            Math.max(roomBoundary.xMin + halfWidth, newPos.x),
          );
          newPos.z = Math.min(
            roomBoundary.zMax - halfDepth,
            Math.max(roomBoundary.zMin + halfDepth, newPos.z),
          );

          const prevPos = meshRef.current.position.clone();
          const adjusted = handleCollision(newPos, prevPos);

          // ✅ floating 애니메이션이 덮어쓸 y값을 유지하기 위해 x, z만 반영
          meshRef.current.position.x = adjusted.x;
          meshRef.current.position.z = adjusted.z;

          options?.onDrag?.(
            new Vector3(adjusted.x, meshRef.current.position.y, adjusted.z),
            meshRef.current.rotation.clone(),
          );
        } else if (placementType === 'wall' && intersect.wall) {
          const prevPos = meshRef.current.position.clone();
          const wallInfo = {
            id: intersect.wall.id,
            rotationY: intersect.wall.rotationY,
          };
          const adjusted = handleCollision(newPos, prevPos, wallInfo);
          meshRef.current.position.copy(adjusted);
          meshRef.current.rotation.y = intersect.wall.rotationY;
          options?.onDrag?.(
            adjusted.clone(),
            new THREE.Euler(0, intersect.wall.rotationY, 0),
          );
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
      options,
    ],
  );

  const handlePointerUp = useCallback(() => {
    if (isDragging) {
      setInternalDragging(false);
      setDragging?.(false);
      if (meshRef.current) {
        stopFloating();
      }
      if (meshRef.current && onDragEnd) {
        let final = meshRef.current.position.clone();
        let finalRotation = meshRef.current.rotation.y;
        if (placementType === 'floor') {
          final = checkFinalPosition(final);
          final.y = roomBoundary.yMin;
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
    roomBoundary.yMin,
  ]);

  useEffect(() => {
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointermove', handlePointerMove);
    return () => {
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [handlePointerUp, handlePointerMove]);

  return { onPointerDown: handlePointerDown };
}
