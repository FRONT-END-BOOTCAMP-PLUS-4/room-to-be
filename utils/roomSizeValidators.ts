import { squareMeterToPyeong } from '@/stores/useRoomSizeStore';

import {
  MAX_PYEONG,
  MAX_WALL_HEIGHT,
  MIN_PYEONG,
  MIN_WALL_HEIGHT,
} from './roomSizeConstants';

const ERROR_MESSAGES = {
  PYEONG_REQUIRED: '평수를 입력해주세요.',
  PYEONG_MIN: `최소 ${MIN_PYEONG}평 이상이어야 합니다.`,
  PYEONG_MAX: `최대 ${MAX_PYEONG}평까지만 지원합니다.`,
  AREA_REQUIRED: '방의 면적을 입력해주세요.',
  WALL_HEIGHT_REQUIRED: '벽 높이를 입력해주세요.',
  WALL_HEIGHT_MIN: `벽 높이는 최소 ${MIN_WALL_HEIGHT}m 이상이어야 합니다.`,
  WALL_HEIGHT_MAX: `벽 높이는 최대 ${MAX_WALL_HEIGHT}m까지만 지원합니다.`,
};

// 평수 유효성 검사
export const validatePyeong = (value: number | null): string => {
  if (value === null || isNaN(Number(value))) {
    return ERROR_MESSAGES.PYEONG_REQUIRED;
  } else if (value < MIN_PYEONG) {
    return ERROR_MESSAGES.PYEONG_MIN;
  } else if (value > MAX_PYEONG) {
    return ERROR_MESSAGES.PYEONG_MAX;
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
    return ERROR_MESSAGES.AREA_REQUIRED;
  }

  const area = width * height;
  const newPyeong = squareMeterToPyeong(area);

  if (newPyeong < MIN_PYEONG) {
    return ERROR_MESSAGES.PYEONG_MIN;
  } else if (newPyeong > MAX_PYEONG) {
    return ERROR_MESSAGES.PYEONG_MAX;
  }

  return '';
};

// 벽 높이 유효성 검사
export const validateWallHeight = (value: number | null): string => {
  if (value === null || isNaN(Number(value)) || value <= 0) {
    return ERROR_MESSAGES.WALL_HEIGHT_REQUIRED;
  } else if (value < MIN_WALL_HEIGHT) {
    return ERROR_MESSAGES.WALL_HEIGHT_MIN;
  } else if (value > MAX_WALL_HEIGHT) {
    return ERROR_MESSAGES.WALL_HEIGHT_MAX;
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

  // 미터 모드에서 가로, 세로, 높이 모두 없거나 0인 경우
  if (
    mode === 'meter' &&
    (localWidth === null || localWidth <= 0) &&
    (localHeight === null || localHeight <= 0) &&
    (localWallHeight === null || localWallHeight <= 0)
  ) {
    const error = ERROR_MESSAGES.AREA_REQUIRED;
    fieldErrors.width = error;
    fieldErrors.height = error;
    fieldErrors.wallHeight = error;
    return { isValid: false, error, fieldErrors };
  }

  // 가로 또는 세로가 없거나 0인 경우 (미터 모드에서만)
  if (
    mode === 'meter' &&
    (localWidth === null ||
      localWidth <= 0 ||
      localHeight === null ||
      localHeight <= 0)
  ) {
    const error = ERROR_MESSAGES.AREA_REQUIRED;
    if (localWidth === null || localWidth <= 0) fieldErrors.width = error;
    if (localHeight === null || localHeight <= 0) fieldErrors.height = error;
    return { isValid: false, error, fieldErrors };
  }

  if (localWallHeight === null) {
    const error = ERROR_MESSAGES.WALL_HEIGHT_REQUIRED;
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
      const error = ERROR_MESSAGES.PYEONG_REQUIRED;
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
      const error = ERROR_MESSAGES.AREA_REQUIRED;
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
