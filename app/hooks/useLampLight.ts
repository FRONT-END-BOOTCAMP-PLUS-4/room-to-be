import { useEffect } from 'react';
import * as THREE from 'three';

import { useBackgroundStore } from '@/stores/useBackgroundStore';
import { useLightingStore } from '@/stores/useLightingStore';

interface UseLampLightProps {
  meshRef: React.RefObject<THREE.Group>;
  name: string;
}

/**
 * 램프의 실제 발광 부분을 찾아 조명을 배치하는 함수
 */
function findLightPosition(group: THREE.Group): THREE.Vector3 {
  const lightPositions: THREE.Vector3[] = [];
  const boundingBox = new THREE.Box3();

  boundingBox.setFromObject(group);
  const groupSize = boundingBox.getSize(new THREE.Vector3());

  group.traverse((child: THREE.Object3D) => {
    if (!(child as THREE.Mesh).isMesh) return;

    const mesh = child as THREE.Mesh;

    if (mesh.material && 'color' in mesh.material) {
      const material = mesh.material as THREE.MeshStandardMaterial;
      const color = material.color;

      const isBrightColor =
        (color.r > 0.7 && color.g > 0.5 && color.b < 0.4) ||
        (color.r > 0.8 && color.g > 0.8 && color.b > 0.7) ||
        (color.r > 0.6 && color.g > 0.6 && color.b > 0.6);

      const hasEmissive =
        'emissive' in material &&
        (material.emissive.r > 0 ||
          material.emissive.g > 0 ||
          material.emissive.b > 0);

      if (isBrightColor || hasEmissive) {
        const worldPosition = new THREE.Vector3();
        mesh.getWorldPosition(worldPosition);
        const localPosition = group.worldToLocal(worldPosition.clone());
        lightPositions.push(localPosition);
      }
    }
  });

  if (lightPositions.length > 0) {
    const avgPosition = new THREE.Vector3();
    lightPositions.forEach((pos) => avgPosition.add(pos));
    avgPosition.divideScalar(lightPositions.length);
    return avgPosition;
  }

  return new THREE.Vector3(0, groupSize.y * 0.7, 0);
}

/**
 * 램프 가구에 조명 효과를 추가하는 훅
 */
export default function useLampLight({ meshRef, name }: UseLampLightProps) {
  const isDay = useLightingStore((s) => s.isDay);
  const getCurrentBackground = useBackgroundStore(
    (s) => s.getCurrentBackground,
  );
  const currentBackgroundId = useBackgroundStore((s) => s.currentBackgroundId);

  const isLamp =
    name.toLowerCase().includes('램프') ||
    name.toLowerCase().includes('lamp') ||
    name.toLowerCase().includes('스탠드') ||
    name.toLowerCase().includes('조명') ||
    name.toLowerCase().includes('벽등') ||
    name.toLowerCase().includes('라이트') ||
    name.toLowerCase().includes('light');

  useEffect(() => {
    if (!isLamp || !meshRef.current) return;

    const Background = getCurrentBackground();
    const unifiedLightColor = '#ffd89b';
    const lightIntensity = Background.nightLightIntensity * 1.5;

    const lightsToRemove: THREE.PointLight[] = [];
    meshRef.current.traverse((child) => {
      if (child instanceof THREE.PointLight && child.userData._isLampLight) {
        lightsToRemove.push(child);
      }
    });
    lightsToRemove.forEach((light) => {
      meshRef.current?.remove(light);
    });

    if (!isDay) {
      const isWallLamp = name.toLowerCase().includes('벽등');

      if (isWallLamp) {
        const light = new THREE.PointLight(
          unifiedLightColor,
          lightIntensity * 0.4,
          3,
          2,
        );

        light.position.set(0, 0, 0.1);
        light.userData._isLampLight = true;

        meshRef.current.add(light);

        light.castShadow = true;
        light.shadow.mapSize.width = 256;
        light.shadow.mapSize.height = 256;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 5;
      } else {
        const lightPosition = findLightPosition(meshRef.current);

        const light = new THREE.PointLight(
          unifiedLightColor,
          lightIntensity,
          5,
          1.5,
        );

        light.position.copy(lightPosition);
        light.userData._isLampLight = true;

        meshRef.current.add(light);

        light.castShadow = true;
        light.shadow.mapSize.width = 512;
        light.shadow.mapSize.height = 512;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 10;
      }
    }

    return () => {
      if (meshRef.current) {
        const lightsToRemove: THREE.PointLight[] = [];
        meshRef.current.traverse((child) => {
          if (
            child instanceof THREE.PointLight &&
            child.userData._isLampLight
          ) {
            lightsToRemove.push(child);
          }
        });
        lightsToRemove.forEach((light) => {
          meshRef.current?.remove(light);
        });
      }
    };
  }, [isLamp, isDay, meshRef, getCurrentBackground, currentBackgroundId, name]);

  return { isLamp };
}
