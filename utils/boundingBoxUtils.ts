import { Box3, Mesh, Object3D, Vector3 } from 'three';

// Object3D 내부 전체 Mesh에 기반한 정확한 바운딩 박스 계산
export function getActualBoundingBoxFromObject3D(root: Object3D): Box3 {
  const box = new Box3();
  const tempBox = new Box3();

  root.traverse((child) => {
    if ((child as Mesh).isMesh) {
      tempBox.setFromObject(child);
      box.union(tempBox);
    }
  });

  return box;
}

// 모델을 중심 기준으로 정렬
export function centerizeModel(model: Object3D): void {
  const box = getActualBoundingBoxFromObject3D(model);
  const center = box.getCenter(new Vector3());
  model.position.sub(center);
}
