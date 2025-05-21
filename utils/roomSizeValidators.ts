import { squareMeterToPyeong } from '@/stores/useRoomSizeStore';

import {
  MAX_PYEONG,
  MAX_WALL_HEIGHT,
  MIN_PYEONG,
  MIN_WALL_HEIGHT,
} from './roomSizeConstants';

// 평수 유효성 검사
export const validatePyeong = (value: number | null): string => {
  if (value === null || isNaN(Number(value))) {
    return '평수를 입력해주세요.';
  } else if (value < MIN_PYEONG) {
    return `최소 ${MIN_PYEONG}평 이상이어야 합니다.`;
  } else if (value > MAX_PYEONG) {
    return `최대 ${MAX_PYEONG}평까지만 지원합니다.`;
  }
  return '';
};

// 가로/세로 유효성 검사
export const validateDimension = (
  width: number | null,
  height: number | null,
): string => {
  if (
    width === null ||
    height === null ||
    isNaN(Number(width)) ||
    isNaN(Number(height)) ||
    width <= 0 ||
    height <= 0
  ) {
    return '방 크기를 입력해주세요.';
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
export const validateWallHeight = (value: number | null): string => {
  if (value === null || isNaN(Number(value))) {
    return '벽 높이를 입력해주세요.';
  } else if (value <= 0) {
    return '벽 높이를 정확하게 입력해주세요.';
  } else if (value < MIN_WALL_HEIGHT) {
    return `벽 높이는 최소 ${MIN_WALL_HEIGHT}m 이상이어야 합니다.`;
  } else if (value > MAX_WALL_HEIGHT) {
    return `벽 높이는 최대 ${MAX_WALL_HEIGHT}m까지만 지원합니다.`;
  }
  return '';
};

// 폼 전체 유효성 검사
export const validateRoomSizeForm = (
  mode: 'pyeong' | 'meter',
  localPyeong: number | null,
  localWidth: number | null,
  localHeight: number | null,
  localWallHeight: number | null,
): {
  isValid: boolean;
  error: string;
  fieldErrors: Partial<Record<string, string>>;
} => {
  const fieldErrors: Partial<Record<string, string>> = {};

  if (localWallHeight === null) {
    const error = '벽 높이를 입력해주세요.';
    fieldErrors.wallHeight = error;
    return { isValid: false, error, fieldErrors };
  }

  const wallHeightError = validateWallHeight(localWallHeight);
  if (wallHeightError) {
    fieldErrors.wallHeight = wallHeightError;
    return { isValid: false, error: wallHeightError, fieldErrors };
  }

  if (mode === 'pyeong') {
    if (localPyeong === null) {
      const error = '평수를 입력해주세요.';
      fieldErrors.pyeong = error;
      return { isValid: false, error, fieldErrors };
    }

    const pyeongError = validatePyeong(localPyeong);
    if (pyeongError) {
      fieldErrors.pyeong = pyeongError;
      return { isValid: false, error: pyeongError, fieldErrors };
    }
  } else {
    if (localWidth === null || localHeight === null) {
      const error = '방 크기를 입력해주세요.';
      if (localWidth === null) fieldErrors.width = error;
      if (localHeight === null) fieldErrors.height = error;
      return { isValid: false, error, fieldErrors };
    }

    const dimensionError = validateDimension(localWidth, localHeight);
    if (dimensionError) {
      fieldErrors.width = dimensionError;
      fieldErrors.height = dimensionError;
      return { isValid: false, error: dimensionError, fieldErrors };
    }
  }

  return { isValid: true, error: '', fieldErrors: {} };
};
