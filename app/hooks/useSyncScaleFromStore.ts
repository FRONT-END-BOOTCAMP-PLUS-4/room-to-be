import { useEffect, Dispatch, SetStateAction } from 'react';

export interface SyncScaleOptions {
  isSelected: boolean;
  selected:
    | {
        scaleX: number;
        scaleY: number;
        scaleZ: number;
      }
    | null;
  current: [number, number, number];
  set: Dispatch<SetStateAction<[number, number, number]>>;
}

// zustand 상의 scale 값과 현재 scale 값을 비교하여 다르다면 zustand 상의 scale로 동기화 시키는 훅
export default function useSyncScaleFromStore({
  isSelected,
  selected,
  current,
  set,
}: SyncScaleOptions) {
  // 배열의 모든 값이 같은 지 확인하는 함수
  const arraysAreEqual = (arr1: number[], arr2: number[]) =>
    arr1.every((v, i) => v === arr2[i]);

  useEffect(() => {
    if (
      isSelected &&
      selected &&
      !arraysAreEqual(
        [selected.scaleX, selected.scaleY, selected.scaleZ],
        current,
      )
    ) {
      set([selected.scaleX, selected.scaleY, selected.scaleZ]);
    }
  }, [isSelected, selected, current, set]);
}
