import { Dispatch, SetStateAction,useEffect } from 'react';

export interface SyncPositionOptions {
  isSelected: boolean;
  selected:
    | {
        positionX: number;
        positionY: number;
        positionZ: number;
      }
    | null;
  current: [number, number, number];
  set: Dispatch<SetStateAction<[number, number, number]>>;
}

// zustand 상의 position 값과 현재 position 값을 비교하여 다르다면 zustand 상의 값으로 동기화 시키는 훅
export default function useSyncPositionFromStore({
  isSelected,
  selected,
  current,
  set,
}: SyncPositionOptions) {
  // 배열의 모든 값이 같은 지 확인하는 함수
  const arraysAreEqual = (arr1: number[], arr2: number[]) =>
    arr1.every((v, i) => v === arr2[i]);

  useEffect(() => {
    if (
      isSelected &&
      selected &&
      !arraysAreEqual(
        [selected.positionX, selected.positionY, selected.positionZ],
        current,
      )
    ) {
      set([selected.positionX, selected.positionY, selected.positionZ]);
    }
  }, [isSelected, selected, current, set]);
}
