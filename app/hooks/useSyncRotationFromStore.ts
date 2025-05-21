import { useEffect } from 'react';
import { Group } from 'three';

interface Props {
  isSelected: boolean;
  selected: { rotationY: number } | null;
  current: number;
  set: (rotationY: number) => void;
  meshRef: React.RefObject<Group>;
}

// zustand 상의 rotation 값과 현재 rotation 값을 비교하여 다르다면 zustand 상의 rotation으로 동기화 시키는 훅
export default function useSyncRotationFromStore({
  isSelected,
  selected,
  current,
  set,
  meshRef,
}: Props) {
  useEffect(() => {
    if (isSelected && selected) {
      const newY = selected.rotationY;

      // 현재 rotationY와 selected.rotationY가 다르면 동기화
      if (Math.abs(current - newY) > 0.001) {
        // ref의 실제 회전 값도 동기화
        if (meshRef.current) {
          meshRef.current.rotation.y = newY;
        }
        set(newY);
      }
    }
  }, [isSelected, selected, current, set, meshRef]);
}