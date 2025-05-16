import { useEffect } from 'react';
import { Group } from 'three';

interface Props {
  isSelected: boolean;
  selected: { rotationY: number } | null;
  set: (rotationY: number) => void;
  meshRef: React.RefObject<Group>;
}

export default function useSyncRotationFromStore({
  isSelected,
  selected,
  set,
  meshRef,
}: Props) {
  useEffect(() => {
    if (isSelected && selected && meshRef.current) {
      const newY = selected.rotationY;
      const currentY = meshRef.current.rotation.y;

      if (Math.abs(currentY - newY) > 0.001) {
        meshRef.current.rotation.y = newY;
        set(newY); 
      }
    }
  }, [isSelected, selected, meshRef, set]);
}
