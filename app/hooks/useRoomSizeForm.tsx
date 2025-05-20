import { useState, useEffect } from 'react';
import {
  useRoomSizeStore,
  pyeongToRoomDimensions,
  squareMeterToPyeong,
} from '@/stores/useRoomSizeStore';

export const MIN_PYEONG = 1;
export const MAX_PYEONG = 10;
export const MIN_WALL_HEIGHT = 2.0;
export const MAX_WALL_HEIGHT = 3.0;

export default function useRoomSizeForm() {
  const {
    mode,
    pyeong,
    width,
    height,
    wallHeight,
    setMode,
    setPyeong,
    setDimensions,
  } = useRoomSizeStore();

  const [localPyeong, setLocalPyeong] = useState<number>(pyeong);
  const [localWidth, setLocalWidth] = useState<number>(width);
  const [localHeight, setLocalHeight] = useState<number>(height);
  const [localWallHeight, setLocalWallHeight] = useState<number>(wallHeight);
  const [error, setError] = useState<string>('');

  // 모드 변경 시 로컬 상태 업데이트
  useEffect(() => {
    if (mode === 'pyeong') {
      // 평수 모드로 전환 시, 현재 가로/세로 값에서 평수 계산
      const area = localWidth * localHeight;
      const calculatedPyeong = Math.round((area / 3.3058) * 100) / 100;

      // 계산된 평수가 제한 범위를 벗어나면 조정
      const validPyeong = Math.min(
        Math.max(calculatedPyeong, MIN_PYEONG),
        MAX_PYEONG,
      );
      setLocalPyeong(validPyeong);
      setError('');
    } else {
      // 미터 모드로 전환 시, 현재 평수에서 가로/세로 계산
      const dimensions = pyeongToRoomDimensions(localPyeong);
      setLocalWidth(dimensions.width);
      setLocalHeight(dimensions.height);
      setError('');
    }
  }, [mode]);

  // 평수 변경 처리 함수
  const handlePyeongChange = (value: number) => {
    if (isNaN(value) || value < MIN_PYEONG) {
      setLocalPyeong(value);
      setError(`최소 ${MIN_PYEONG}평 이상이어야 합니다.`);
    } else if (value > MAX_PYEONG) {
      setLocalPyeong(value);
      setError(`최대 ${MAX_PYEONG}평까지만 지원합니다.`);
    } else {
      setLocalPyeong(value);
      setError('');
    }
  };

  // 가로, 세로 변경 처리 함수
  const handleDimensionChange = (type: 'width' | 'height', value: number) => {
    if (isNaN(value) || value <= 0) {
      if (type === 'width') {
        setLocalWidth(value);
      } else {
        setLocalHeight(value);
      }
      setError('방 크기를 정확하게 입력해주세요.');
      return;
    }

    // 값 업데이트
    if (type === 'width') {
      setLocalWidth(value);
    } else {
      setLocalHeight(value);
    }

    // 평수 계산 및 검증
    const newArea =
      (type === 'width' ? value : localWidth) *
      (type === 'height' ? value : localHeight);
    const newPyeong = squareMeterToPyeong(newArea);

    if (newPyeong < MIN_PYEONG) {
      setError(`최소 ${MIN_PYEONG}평 이상이어야 합니다.`);
    } else if (newPyeong > MAX_PYEONG) {
      setError(`최대 ${MAX_PYEONG}평까지만 지원합니다.`);
    } else {
      setError('');
    }
  };

  // 폼 제출 전 유효성 검사
  const validateForm = (): boolean => {
    if (
      localWallHeight < MIN_WALL_HEIGHT ||
      localWallHeight > MAX_WALL_HEIGHT
    ) {
      setError(
        `벽 높이는 ${MIN_WALL_HEIGHT}m~${MAX_WALL_HEIGHT}m 사이여야 합니다.`,
      );
      return false;
    }

    if (mode === 'pyeong') {
      if (localPyeong < MIN_PYEONG || localPyeong > MAX_PYEONG) {
        setError(`${MIN_PYEONG}평~${MAX_PYEONG}평 사이여야 합니다.`);
        return false;
      }
    } else {
      const area = localWidth * localHeight;
      const calculatedPyeong = squareMeterToPyeong(area);

      if (calculatedPyeong < MIN_PYEONG || calculatedPyeong > MAX_PYEONG) {
        setError(`${MIN_PYEONG}평~${MAX_PYEONG}평 사이여야 합니다.`);
        return false;
      }
    }
    return true;
  };

  // 벽 높이 변경 처리 함수
  const handleWallHeightChange = (value: number) => {
    setLocalWallHeight(value);

    if (isNaN(value) || value <= 0) {
      setError('벽 높이를 정확하게 입력해주세요.');
    } else if (value < MIN_WALL_HEIGHT) {
      setError(`벽 높이는 최소 ${MIN_WALL_HEIGHT}m 이상이어야 합니다.`);
    } else if (value > MAX_WALL_HEIGHT) {
      setError(`벽 높이는 최대 ${MAX_WALL_HEIGHT}m까지만 지원합니다.`);
    } else {
      if (!error || error.includes('벽 높이')) {
        setError('');
      }
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return false;

    if (mode === 'pyeong') {
      setPyeong(localPyeong);
    } else {
      setDimensions(localWidth, localHeight, localWallHeight);
    }

    return true;
  };

  return {
    mode,
    localPyeong,
    localWidth,
    localHeight,
    localWallHeight,
    error,
    setMode,
    handlePyeongChange,
    handleDimensionChange,
    handleWallHeightChange,
    handleSubmit,
  };
}
