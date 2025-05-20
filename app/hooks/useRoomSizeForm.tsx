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

type FieldErrors = {
  pyeong: string;
  width: string;
  height: string;
  wallHeight: string;
};

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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
    pyeong: '',
    width: '',
    height: '',
    wallHeight: '',
  });

  useEffect(() => {
    if (mode === 'pyeong') {
      // 평수 모드로 전환
      const area = localWidth * localHeight;
      const calculatedPyeong = Math.round((area / 3.3058) * 100) / 100;

      // 계산된 평수가 제한 범위를 벗어나면 조정
      const validPyeong = Math.min(
        Math.max(calculatedPyeong, MIN_PYEONG),
        MAX_PYEONG,
      );
      setLocalPyeong(validPyeong);
      setError('');
      setFieldErrors({
        pyeong: '',
        width: '',
        height: '',
        wallHeight: '',
      });
    } else {
      // 미터 모드로 전환
      const dimensions = pyeongToRoomDimensions(localPyeong);
      setLocalWidth(dimensions.width);
      setLocalHeight(dimensions.height);
      setError('');
      setFieldErrors({
        pyeong: '',
        width: '',
        height: '',
        wallHeight: '',
      });
    }
  }, [mode]);

  // 평수 유효성 검사
  const validatePyeong = (value: number): string => {
    if (isNaN(value) || value < MIN_PYEONG) {
      return `최소 ${MIN_PYEONG}평 이상이어야 합니다.`;
    } else if (value > MAX_PYEONG) {
      return `최대 ${MAX_PYEONG}평까지만 지원합니다.`;
    }
    return '';
  };

  // 가로/세로 유효성 검사
  const validateDimension = (width: number, height: number): string => {
    if (isNaN(width) || width <= 0 || isNaN(height) || height <= 0) {
      return '방 크기를 정확하게 입력해주세요.';
    }

    const area = width * height;
    const newPyeong = squareMeterToPyeong(area);

    if (newPyeong < MIN_PYEONG) {
      return `최소 ${MIN_PYEONG}평 이상이어야 합니다.`;
    } else if (newPyeong > MAX_PYEONG) {
      return `최대 ${MAX_PYEONG}평까지만 지원합니다.`;
    }

    return '';
  };

  // 벽 높이 유효성 검사
  const validateWallHeight = (value: number): string => {
    if (isNaN(value) || value <= 0) {
      return '벽 높이를 정확하게 입력해주세요.';
    } else if (value < MIN_WALL_HEIGHT) {
      return `벽 높이는 최소 ${MIN_WALL_HEIGHT}m 이상이어야 합니다.`;
    } else if (value > MAX_WALL_HEIGHT) {
      return `벽 높이는 최대 ${MAX_WALL_HEIGHT}m까지만 지원합니다.`;
    }
    return '';
  };

  // 평수 변경 처리 함수
  const handlePyeongChange = (value: number) => {
    setLocalPyeong(value);
    const pyeongError = validatePyeong(value);

    setFieldErrors((prev) => ({
      ...prev,
      pyeong: pyeongError,
    }));

    if (pyeongError) {
      setError(pyeongError);
    } else {
      setError('');
    }
  };

  // 가로, 세로 변경 처리 함수
  const handleDimensionChange = (type: 'width' | 'height', value: number) => {
    if (type === 'width') {
      setLocalWidth(value);
    } else {
      setLocalHeight(value);
    }

    const newWidth = type === 'width' ? value : localWidth;
    const newHeight = type === 'height' ? value : localHeight;
    const dimensionError = validateDimension(newWidth, newHeight);

    setFieldErrors((prev) => ({
      ...prev,
      width: type === 'width' && dimensionError ? dimensionError : prev.width,
      height:
        type === 'height' && dimensionError ? dimensionError : prev.height,
    }));

    if (dimensionError) {
      setError(dimensionError);
    } else {
      setError('');
    }
  };

  // 벽 높이 변경 처리 함수
  const handleWallHeightChange = (value: number) => {
    setLocalWallHeight(value);
    const wallHeightError = validateWallHeight(value);

    setFieldErrors((prev) => ({
      ...prev,
      wallHeight: wallHeightError,
    }));

    if (wallHeightError) {
      setError(wallHeightError);
    } else {
      setError('');
    }
  };

  // 입력 필드 포커스 시 해당 필드의 유효성 검사 및 에러 표시
  const handleFieldFocus = (field: keyof FieldErrors) => {
    if (field === 'pyeong') {
      const pyeongError = validatePyeong(localPyeong);
      if (pyeongError) {
        setError(pyeongError);
      }
    } else if (field === 'width' || field === 'height') {
      const dimensionError = validateDimension(localWidth, localHeight);
      if (dimensionError) {
        setError(dimensionError);
      }
    } else if (field === 'wallHeight') {
      const wallHeightError = validateWallHeight(localWallHeight);
      if (wallHeightError) {
        setError(wallHeightError);
      }
    }
  };

  // 폼 제출 전 유효성 검사
  const validateForm = (): boolean => {
    const wallHeightError = validateWallHeight(localWallHeight);

    if (wallHeightError) {
      setError(wallHeightError);
      setFieldErrors((prev) => ({ ...prev, wallHeight: wallHeightError }));
      return false;
    }

    if (mode === 'pyeong') {
      const pyeongError = validatePyeong(localPyeong);
      if (pyeongError) {
        setError(pyeongError);
        setFieldErrors((prev) => ({ ...prev, pyeong: pyeongError }));
        return false;
      }
    } else {
      const dimensionError = validateDimension(localWidth, localHeight);
      if (dimensionError) {
        setError(dimensionError);
        setFieldErrors((prev) => ({
          ...prev,
          width: dimensionError,
          height: dimensionError,
        }));
        return false;
      }
    }
    return true;
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
    fieldErrors,
    setMode,
    handlePyeongChange,
    handleDimensionChange,
    handleWallHeightChange,
    handleFieldFocus,
    handleSubmit,
  };
}
