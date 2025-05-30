import { Box3, Object3D, Vector3 } from 'three';

import { FurnitureStoreInfo } from '@/app/types/furniture';

// 가구의 방향을 고려한 경계 상자를 생성
export function createBoundingBox(
  furniture: FurnitureStoreInfo,
  object?: Object3D,
  position?: Vector3,
): Box3 {
  // 가구의 현재 크기와 위치 정보
  const { baseX, baseY, baseZ, scaleX, scaleY, scaleZ } = furniture;

  // 가구 크기 계산 (mm 단위를 m 단위로 변환)
  const width = ((baseX || 0) / 1000) * scaleX;
  const height = ((baseY || 0) / 1000) * scaleY;
  const depth = ((baseZ || 0) / 1000) * scaleZ;

  // 반폭 계산
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const halfDepth = depth / 2;

  // 위치 정보 (제공된 위치 또는 가구의 현재 위치)
  const pos =
    position ||
    new Vector3(furniture.positionX, furniture.positionY, furniture.positionZ);

  // 경계 상자 생성
  const boundingBox = new Box3();

  // 가구 타입에 따라 경계 상자 설정
  if (furniture.placementType === 'floor') {
    // 바닥 가구: y 위치는 바닥에 고정, 높이만큼 올라감
    boundingBox.min.set(pos.x - halfWidth, pos.y, pos.z - halfDepth);
    boundingBox.max.set(pos.x + halfWidth, pos.y + height, pos.z + halfDepth);
  } else if (furniture.placementType === 'wall') {
    // 벽 가구: 회전에 따른 정확한 바운딩 박스 계산
    const rotationY = furniture.rotationY || 0;
    
    // 회전 고려한 실제 크기 계산 (더 정확한 회전 각도 처리)
    let actualWidth, actualDepth;
    const normalizedRotation = ((rotationY % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
    
    if (normalizedRotation < Math.PI / 4 || normalizedRotation > 7 * Math.PI / 4 || 
        (normalizedRotation > 3 * Math.PI / 4 && normalizedRotation < 5 * Math.PI / 4)) {
      // 0도 또는 180도 근처
      actualWidth = width;
      actualDepth = depth;
    } else {
      // 90도 또는 270도 근처 (크기 교체)
      actualWidth = depth;
      actualDepth = width;
    }
    
    const actualHalfWidth = actualWidth / 2;
    const actualHalfDepth = actualDepth / 2;
    
    boundingBox.min.set(
      pos.x - actualHalfWidth, 
      pos.y - halfHeight, 
      pos.z - actualHalfDepth
    );
    boundingBox.max.set(
      pos.x + actualHalfWidth, 
      pos.y + halfHeight, 
      pos.z + actualHalfDepth
    );
  }

  // 메시 오브젝트가 제공된 경우 해당 객체로부터 바운딩 박스 계산
  if (object) {
    const objectBox = new Box3().setFromObject(object);
    return objectBox;
  }

  return boundingBox;
}

// 두 경계 상자 간의 충돌 감지
export function detectCollision(box1: Box3, box2: Box3): boolean {
  return box1.intersectsBox(box2);
}

// 벽 ID로부터 벽의 방향 벡터 계산
function getWallNormal(wallId: string): Vector3 {
  switch (wallId) {
    case 'front': return new Vector3(0, 0, 1);  // 앞벽 (z+ 방향)
    case 'back': return new Vector3(0, 0, -1);  // 뒷벽 (z- 방향)
    case 'left': return new Vector3(1, 0, 0);   // 왼쪽벽 (x+ 방향)
    case 'right': return new Vector3(-1, 0, 0); // 오른쪽벽 (x- 방향)
    default: return new Vector3(0, 0, 0);
  }
}

// 벽에 부착된 가구의 이동 가능한 축들 계산
function getWallMovementAxes(wallId: string): { primary: string; secondary: string } {
  switch (wallId) {
    case 'front':
    case 'back':
      return { primary: 'x', secondary: 'y' }; // x축과 y축으로 이동 가능
    case 'left':
    case 'right':
      return { primary: 'z', secondary: 'y' }; // z축과 y축으로 이동 가능
    default:
      return { primary: 'x', secondary: 'z' }; // 기본값
  }
}

// 벽용 가구의 충돌 방향 계산 
export function getWallCollisionDirection(
  movingBox: Box3,
  staticBox: Box3,
  movingPos: Vector3,
  previousPos: Vector3,
  wallId: string,
): Vector3 {
  const movingCenter = new Vector3();
  movingBox.getCenter(movingCenter);

  const staticCenter = new Vector3();
  staticBox.getCenter(staticCenter);

  // 상자 간의 방향 벡터
  const boxDirection = new Vector3().subVectors(movingCenter, staticCenter);

  // 벽에 따른 이동 가능한 축 결정
  const axes = getWallMovementAxes(wallId);
  
  // 각 축에서의 겹침 정도 계산
  const overlaps = {
    x: Math.min(movingBox.max.x - staticBox.min.x, staticBox.max.x - movingBox.min.x),
    y: Math.min(movingBox.max.y - staticBox.min.y, staticBox.max.y - movingBox.min.y),
    z: Math.min(movingBox.max.z - staticBox.min.z, staticBox.max.z - movingBox.min.z)
  };

  // 벽의 primary와 secondary 축 중에서 더 작은 겹침을 가진 축으로 밀어냄
  const primaryAxis = axes.primary as keyof typeof overlaps;
  const secondaryAxis = axes.secondary as keyof typeof overlaps;
  
  const primaryOverlap = overlaps[primaryAxis];
  const secondaryOverlap = overlaps[secondaryAxis];

  // 더 작은 겹침을 가진 축 방향으로 충돌 해결
  if (primaryOverlap < secondaryOverlap) {
    const direction = new Vector3();
    direction[primaryAxis] = boxDirection[primaryAxis] > 0 ? 1 : -1;
    return direction;
  } else {
    const direction = new Vector3();
    direction[secondaryAxis] = boxDirection[secondaryAxis] > 0 ? 1 : -1;
    return direction;
  }
}

// 가구 간의 충돌 방향 계산 (일반 가구용)
export function getCollisionDirection(
  movingBox: Box3,
  staticBox: Box3,
  movingPos: Vector3,
  previousPos: Vector3,
): Vector3 {
  const movingCenter = new Vector3();
  movingBox.getCenter(movingCenter);

  const staticCenter = new Vector3();
  staticBox.getCenter(staticCenter);

  const boxDirection = new Vector3().subVectors(movingCenter, staticCenter);

  // x축과 z축 방향의 충돌 깊이 계산
  const xOverlap = Math.min(movingBox.max.x - staticBox.min.x, staticBox.max.x - movingBox.min.x);
  const zOverlap = Math.min(movingBox.max.z - staticBox.min.z, staticBox.max.z - movingBox.min.z);

  // 충돌 깊이가 적은 방향으로 미끄러지도록 방향 조정
  if (xOverlap < zOverlap) {
    return new Vector3(boxDirection.x > 0 ? 1 : -1, 0, 0);
  } else {
    return new Vector3(0, 0, boxDirection.z > 0 ? 1 : -1);
  }
}

// 벽용 가구의 충돌 해결을 위한 새 위치 계산 (개선된 버전)
export function resolveWallCollision(
  movingBox: Box3,
  staticBox: Box3,
  currentPos: Vector3,
  previousPos: Vector3,
  slidingDirection: Vector3,
  wallId: string,
): Vector3 {
  const resolvedPos = currentPos.clone();

  // 안전 마진 추가 (작은 간격 유지)
  const SAFETY_MARGIN = 0.001;

  // 정확한 반폭 계산
  const movingHalfWidth = (movingBox.max.x - movingBox.min.x) / 2;
  const movingHalfHeight = (movingBox.max.y - movingBox.min.y) / 2;
  const movingHalfDepth = (movingBox.max.z - movingBox.min.z) / 2;

  // 각 축별로 충돌 해결
  if (slidingDirection.x !== 0) {
    if (slidingDirection.x > 0) {
      resolvedPos.x = staticBox.max.x + movingHalfWidth + SAFETY_MARGIN;
    } else {
      resolvedPos.x = staticBox.min.x - movingHalfWidth - SAFETY_MARGIN;
    }
  }

  if (slidingDirection.y !== 0) {
    if (slidingDirection.y > 0) {
      resolvedPos.y = staticBox.max.y + movingHalfHeight + SAFETY_MARGIN;
    } else {
      resolvedPos.y = staticBox.min.y - movingHalfHeight - SAFETY_MARGIN;
    }
  }

  if (slidingDirection.z !== 0) {
    if (slidingDirection.z > 0) {
      resolvedPos.z = staticBox.max.z + movingHalfDepth + SAFETY_MARGIN;
    } else {
      resolvedPos.z = staticBox.min.z - movingHalfDepth - SAFETY_MARGIN;
    }
  }

  // 벽의 경계 내에서만 이동하도록 제한 
  return clampToWallBounds(resolvedPos, wallId);
}

// 벽의 경계 내에서 위치 제한
function clampToWallBounds(position: Vector3, wallId: string): Vector3 {
  const clampedPos = position.clone();
  
  // 벽별 이동 제한 (필요에 따라 방 크기에 맞게 조정)
  const ROOM_BOUNDS = {
    minX: -5, maxX: 5,
    minY: 0, maxY: 3,
    minZ: -5, maxZ: 5
  };

  switch (wallId) {
    case 'front':
    case 'back':
      clampedPos.x = Math.max(ROOM_BOUNDS.minX, Math.min(ROOM_BOUNDS.maxX, clampedPos.x));
      clampedPos.y = Math.max(ROOM_BOUNDS.minY, Math.min(ROOM_BOUNDS.maxY, clampedPos.y));
      break;
    case 'left':
    case 'right':
      clampedPos.z = Math.max(ROOM_BOUNDS.minZ, Math.min(ROOM_BOUNDS.maxZ, clampedPos.z));
      clampedPos.y = Math.max(ROOM_BOUNDS.minY, Math.min(ROOM_BOUNDS.maxY, clampedPos.y));
      break;
  }

  return clampedPos;
}

// 일반 가구의 충돌 해결
export function resolveCollision(
  movingBox: Box3,
  staticBox: Box3,
  currentPos: Vector3,
  previousPos: Vector3,
  slidingDirection: Vector3,
): Vector3 {
  const resolvedPos = currentPos.clone();
  const SAFETY_MARGIN = 0.001;

  const movingHalfWidth = (movingBox.max.x - movingBox.min.x) / 2;
  const movingHalfHeight = (movingBox.max.y - movingBox.min.y) / 2;
  const movingHalfDepth = (movingBox.max.z - movingBox.min.z) / 2;

  if (slidingDirection.x !== 0) {
    if (slidingDirection.x > 0) {
      resolvedPos.x = staticBox.max.x + movingHalfWidth + SAFETY_MARGIN;
    } else {
      resolvedPos.x = staticBox.min.x - movingHalfWidth - SAFETY_MARGIN;
    }
  }
  
  if (slidingDirection.z !== 0) {
    if (slidingDirection.z > 0) {
      resolvedPos.z = staticBox.max.z + movingHalfDepth + SAFETY_MARGIN;
    } else {
      resolvedPos.z = staticBox.min.z - movingHalfDepth - SAFETY_MARGIN;
    }
  }

  if (slidingDirection.y !== 0) {
    if (slidingDirection.y > 0) {
      resolvedPos.y = staticBox.max.y + movingHalfHeight + SAFETY_MARGIN;
    } else {
      resolvedPos.y = staticBox.min.y - movingHalfHeight - SAFETY_MARGIN;
    }
  }

  return resolvedPos;
}

// 벽용 가구의 충돌 응답 계산
export function calculateWallCollisionResponse(
  movingBox: Box3,
  staticBox: Box3,
  currentPos: Vector3,
  previousPos: Vector3,
  wallId: string,
): { collision: boolean; slidingDirection: Vector3 | null; resolvedPosition?: Vector3 } {
  const collision = movingBox.intersectsBox(staticBox);

  if (!collision) {
    return { collision: false, slidingDirection: null };
  }

  const slidingDirection = getWallCollisionDirection(
    movingBox,
    staticBox,
    currentPos,
    previousPos,
    wallId,
  );

  const resolvedPosition = resolveWallCollision(
    movingBox,
    staticBox,
    currentPos,
    previousPos,
    slidingDirection,
    wallId,
  );

  return { collision, slidingDirection, resolvedPosition };
}

// 일반 가구의 충돌 응답 계산
export function calculateCollisionResponse(
  movingBox: Box3,
  staticBox: Box3,
  currentPos: Vector3,
  previousPos: Vector3,
): { collision: boolean; slidingDirection: Vector3 | null; resolvedPosition?: Vector3 } {
  const collision = movingBox.intersectsBox(staticBox);

  if (!collision) {
    return { collision: false, slidingDirection: null };
  }

  const slidingDirection = getCollisionDirection(
    movingBox,
    staticBox,
    currentPos,
    previousPos,
  );

  const resolvedPosition = resolveCollision(
    movingBox,
    staticBox,
    currentPos,
    previousPos,
    slidingDirection,
  );

  return { collision, slidingDirection, resolvedPosition };
}

// 다중 가구와의 충돌 처리
export function resolveMultipleCollisions(
  movingFurniture: FurnitureStoreInfo,
  movingBox: Box3,
  staticFurnitures: FurnitureStoreInfo[],
  currentPos: Vector3,
  previousPos: Vector3,
  wallId?: string, // wallId를 별도 매개변수로 받음
): Vector3 {
  let resolvedPos = currentPos.clone();
  let hasCollision = true;
  let iterations = 0;
  const MAX_ITERATIONS = 10;

  while (hasCollision && iterations < MAX_ITERATIONS) {
    hasCollision = false;
    iterations++;

    // 현재 위치에서 바운딩 박스 재계산
    const currentMovingBox = createBoundingBox(movingFurniture, undefined, resolvedPos);

    for (const staticFurniture of staticFurnitures) {
      const staticBox = createBoundingBox(staticFurniture);
      
      let collisionResponse;
      
      // 벽용 가구와 일반 가구에 따른 충돌 처리 분기
      if (movingFurniture.placementType === 'wall' && wallId) {
        collisionResponse = calculateWallCollisionResponse(
          currentMovingBox,
          staticBox,
          resolvedPos,
          previousPos,
          wallId,
        );
      } else {
        collisionResponse = calculateCollisionResponse(
          currentMovingBox,
          staticBox,
          resolvedPos,
          previousPos,
        );
      }

      if (collisionResponse.collision && collisionResponse.resolvedPosition) {
        resolvedPos = collisionResponse.resolvedPosition;
        hasCollision = true;
        break; // 하나의 충돌을 해결하고 다시 검사
      }
    }
  }

  return resolvedPos;
}