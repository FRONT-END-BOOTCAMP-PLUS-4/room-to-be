import { useCallback } from 'react';
import { FurnitureStoreInfo } from '../types/furniture';
interface UseResettableFurnitureReturn {
  isResettable: boolean;
  resetFurniture: () => void;
}

export function useResettableFurniture(
  selectedFurniture: FurnitureStoreInfo | null,
  updateSelectedFurniture: (newInfo: Partial<FurnitureStoreInfo>) => void,
): UseResettableFurnitureReturn {

  const isResettable = Boolean(
    selectedFurniture &&
    selectedFurniture.originalPositionX !== undefined &&
    selectedFurniture.originalPositionY !== undefined &&
    selectedFurniture.originalPositionZ !== undefined &&
    selectedFurniture.originalScaleX !== undefined &&
    selectedFurniture.originalScaleY !== undefined &&
    selectedFurniture.originalScaleZ !== undefined &&
    selectedFurniture.originalRotationY !== undefined &&
    selectedFurniture.originalBaseX !== undefined &&
    selectedFurniture.originalBaseY !== undefined &&
    selectedFurniture.originalBaseZ !== undefined &&
    
    // 현재 값과 original 값이 하나라도 다르면 true, 모두 같으면 false
    (
      selectedFurniture.positionX !== selectedFurniture.originalPositionX ||
      selectedFurniture.positionY !== selectedFurniture.originalPositionY ||
      selectedFurniture.positionZ !== selectedFurniture.originalPositionZ ||
      selectedFurniture.scaleX !== selectedFurniture.originalScaleX ||
      selectedFurniture.scaleY !== selectedFurniture.originalScaleY ||
      selectedFurniture.scaleZ !== selectedFurniture.originalScaleZ ||
      selectedFurniture.rotationY !== selectedFurniture.originalRotationY ||
      selectedFurniture.baseX !== selectedFurniture.originalBaseX ||
      selectedFurniture.baseY !== selectedFurniture.originalBaseY ||
      selectedFurniture.baseZ !== selectedFurniture.originalBaseZ
    )
  );

  const resetFurniture = useCallback(() => {
    if (!selectedFurniture || !isResettable) return;

    updateSelectedFurniture({
      positionX: selectedFurniture.originalPositionX!,
      positionY: selectedFurniture.originalPositionY!,
      positionZ: selectedFurniture.originalPositionZ!,
      scaleX: selectedFurniture.originalScaleX!,
      scaleY: selectedFurniture.originalScaleY!,
      scaleZ: selectedFurniture.originalScaleZ!,
      rotationY: selectedFurniture.originalRotationY!,
      baseX: selectedFurniture.originalBaseX!,
      baseY: selectedFurniture.originalBaseY!,
      baseZ: selectedFurniture.originalBaseZ!,
    });
  }, [selectedFurniture, isResettable, updateSelectedFurniture]);

  return { isResettable, resetFurniture };
}