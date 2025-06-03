import { Box3, Object3D } from 'three';

export function createBoundingBoxFromGLTF(object: Object3D): Box3 {
  const box = new Box3();
  box.setFromObject(object);
  return box;
}
