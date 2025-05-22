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
    // 벽 가구: z 위치는 벽에 고정, 두께는 얇게
    boundingBox.min.set(pos.x - halfWidth, pos.y - halfHeight, pos.z);
    boundingBox.max.set(pos.x + halfWidth, pos.y + halfHeight, pos.z + depth);
  }

  // 메시 오브젝트가 제공된 경우 해당 객체로부터 바운딩 박스 계산
  if (object) {
    // 객체의 월드 위치 및 크기를 고려한 바운딩 박스 계산
    const objectBox = new Box3().setFromObject(object);
    return objectBox;
  }

  return boundingBox;
}

// 두 경계 상자 간의 충돌 감지
export function detectCollision(box1: Box3, box2: Box3): boolean {
  return box1.intersectsBox(box2);
}

// 가구 간의 충돌 방향 계산 (충돌 해결을 위한 방향 벡터)
export function getCollisionDirection(
  movingBox: Box3,
  staticBox: Box3,
  movingPos: Vector3,
  previousPos: Vector3,
): Vector3 {
  // 충돌 방향 계산
  const direction = new Vector3();

  // 방향 계산: 이전 위치에서 현재 위치로의 이동 방향
  direction.subVectors(movingPos, previousPos).normalize();

  // 가구 간 거리 계산
  const movingCenter = new Vector3();
  movingBox.getCenter(movingCenter);

  const staticCenter = new Vector3();
  staticBox.getCenter(staticCenter);

  // 상자 간의 방향 벡터
  const boxDirection = new Vector3().subVectors(movingCenter, staticCenter);

  // x축과 z축 방향의 충돌 깊이 계산
  const xOverlap =
    movingBox.max.x - staticBox.min.x < staticBox.max.x - movingBox.min.x
      ? movingBox.max.x - staticBox.min.x
      : staticBox.max.x - movingBox.min.x;

  const zOverlap =
    movingBox.max.z - staticBox.min.z < staticBox.max.z - movingBox.min.z
      ? movingBox.max.z - staticBox.min.z
      : staticBox.max.z - movingBox.min.z;

  // 충돌 깊이가 적은 방향으로 미끄러지도록 방향 조정
  if (xOverlap < zOverlap) {
    // x축 방향으로 미끄러짐
    return new Vector3(boxDirection.x > 0 ? 1 : -1, 0, 0);
  } else {
    // z축 방향으로 미끄러짐
    return new Vector3(0, 0, boxDirection.z > 0 ? 1 : -1);
  }
}

// 충돌 해결을 위한 새 위치 계산
export function resolveCollision(
  movingBox: Box3,
  staticBox: Box3,
  currentPos: Vector3,
  previousPos: Vector3,
  slidingDirection: Vector3,
): Vector3 {
  // 이동 방향
  const moveDir = new Vector3().subVectors(currentPos, previousPos).normalize();

  // 충돌 해결 후 위치
  const resolvedPos = currentPos.clone();

  // 슬라이딩 방향으로 이동
  if (slidingDirection.x !== 0) {
    // x축 방향 슬라이딩
    if (slidingDirection.x > 0) {
      // 오른쪽으로 이동
      resolvedPos.x = staticBox.max.x + (movingBox.max.x - currentPos.x);
    } else {
      // 왼쪽으로 이동
      resolvedPos.x = staticBox.min.x - (currentPos.x - movingBox.min.x);
    }

    // z축 이동 유지
    resolvedPos.z = currentPos.z;
  } else if (slidingDirection.z !== 0) {
    // z축 방향 슬라이딩
    if (slidingDirection.z > 0) {
      // 앞으로 이동
      resolvedPos.z = staticBox.max.z + (movingBox.max.z - currentPos.z);
    } else {
      // 뒤로 이동
      resolvedPos.z = staticBox.min.z - (currentPos.z - movingBox.min.z);
    }

    // x축 이동 유지
    resolvedPos.x = currentPos.x;
  }

  return resolvedPos;
}

// 두 경계 상자의 충돌 여부와 슬라이딩 방향 계산
export function calculateCollisionResponse(
  movingBox: Box3,
  staticBox: Box3,
  currentPos: Vector3,
  previousPos: Vector3,
): { collision: boolean; slidingDirection: Vector3 | null } {
  // 충돌 감지
  const collision = movingBox.intersectsBox(staticBox);

  if (!collision) {
    return { collision: false, slidingDirection: null };
  }

  // 충돌 발생 시 슬라이딩 방향 계산
  const slidingDirection = getCollisionDirection(
    movingBox,
    staticBox,
    currentPos,
    previousPos,
  );

  return { collision, slidingDirection };
}
