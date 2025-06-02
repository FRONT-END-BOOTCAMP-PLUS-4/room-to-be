import { useMemo } from 'react';
import { Box3, Object3D, Vector3 } from 'three';

// 실제 Object3D 기준 바운딩 박스를 통해 baseSize 계산
export default function useGetBaseSize(object?: Object3D) {
  return useMemo(() => {
    if (!object) return { baseSizeWithScale: null, baseSizeRaw: null };

    const box = new Box3().setFromObject(object);
    const size = box.getSize(new Vector3());

    // scale을 고려하지 않은 순수 base size (m 단위)
    const baseSizeRaw: [number, number, number] = [size.x, size.y, size.z];

    // object.scale은 group에 적용된 경우가 많기 때문에 직접 곱해줌
    const scale = object.scale;
    const baseSizeWithScale: [number, number, number] = [
      size.x * scale.x,
      size.y * scale.y,
      size.z * scale.z,
    ];

    return { baseSizeRaw, baseSizeWithScale };
  }, [object]);
}
