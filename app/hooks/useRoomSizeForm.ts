import { useCallback, useEffect, useState } from 'react';

import { FieldErrors } from '@/utils/roomSizeConstants';
import {
  validateDimension,
  validatePyeong,
  validateRoomSizeForm,
  validateWallHeight,
} from '@/utils/roomSizeValidators';

import {
  pyeongToRoomDimensions,
  useRoomSizeStore,
} from '@/stores/useRoomSizeStore';

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

  const [localPyeong, setLocalPyeong] = useState<number | null>(pyeong || null);
  const [localWidth, setLocalWidth] = useState<number | null>(width || null);
  const [localHeight, setLocalHeight] = useState<number | null>(height || null);
  const [localWallHeight, setLocalWallHeight] = useState<number | null>(
    wallHeight || null,
  );
  const [error, setError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
    pyeong: '',
    width: '',
    height: '',
    wallHeight: '',
  });
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  // 가로/세로 값을 동시에 설정하는 함수
  const setSameWidthHeight = useCallback((value: number | null) => {
    setLocalWidth(value);
    setLocalHeight(value);
  }, []);

  useEffect(() => {
    handleModeChange();
  }, [mode]);

  // 세로 값이 변경될 때 가로 값도 변경
  useEffect(() => {
    if (mode === 'meter' && localHeight !== null) {
      setLocalHeight(localHeight);
    }
  }, [localHeight, mode]);

  // 가로 값이 변경될 때 세로 값도 변경
  useEffect(() => {
    if (mode === 'meter' && localWidth !== null) {
      setLocalHeight(localWidth);
    }
  }, [localWidth, mode]);

  const handleModeChange = () => {
    setError('');
    setFieldErrors({
      pyeong: '',
      width: '',
      height: '',
      wallHeight: '',
    });
    setAttemptedSubmit(false);

    // 모드를 바꿀 때는 기존 입력값 유지
    if (mode === 'pyeong') {
      // 미터 모드에서 평수 모드로 전환
      if (!localPyeong && localWidth && localHeight) {
        const area = localWidth * localHeight;
        const calculatedPyeong = Math.round((area / 3.3058) * 100) / 100;
        const validPyeong = Math.min(Math.max(calculatedPyeong, 1), 10);
        setLocalPyeong(validPyeong);
      }
    } else {
      // 평수 모드에서 미터 모드로 전환
      if (localPyeong && (!localWidth || !localHeight)) {
        const dimensions = pyeongToRoomDimensions(localPyeong);
        setLocalHeight(dimensions.height);
      }

      if (localWallHeight === null) {
        setLocalWallHeight(2.5);
      }
    }
  };

  // 평수 변경 처리 함수
  const handlePyeongChange = (value: number | null) => {
    setLocalPyeong(value);

    setFieldErrors((prev) => ({
      ...prev,
      pyeong: '',
    }));
    setError('');

    // 이미 제출을 시도했었거나 값이 유효하지 않은 경우에만 검증
    if (value !== null && (attemptedSubmit || value <= 0 || value > 10)) {
      const pyeongError = validatePyeong(value);
      if (pyeongError) {
        setFieldErrors((prev) => ({
          ...prev,
          pyeong: pyeongError,
        }));
        setError(pyeongError);
      }
    }
  };

  // 가로 변경 처리 함수
  const handleWidthChange = (value: number | null) => {
    setSameWidthHeight(value);

    setFieldErrors((prev) => ({
      ...prev,
      width: '',
      height: '',
    }));

    setError('');

    // 값 검증
    if (attemptedSubmit && value !== null) {
      const dimensionError = validateDimension(value, value);
      if (dimensionError) {
        setFieldErrors((prev) => ({
          ...prev,
          width: dimensionError,
          height: dimensionError,
        }));
        setError(dimensionError);
      }
    }
  };

  // 세로 변경 처리 함수
  const handleHeightChange = (value: number | null) => {
    setSameWidthHeight(value);

    setFieldErrors((prev) => ({
      ...prev,
      width: '',
      height: '',
    }));

    setError('');

    // 값 검증
    if (attemptedSubmit && value !== null) {
      const dimensionError = validateDimension(value, value);
      if (dimensionError) {
        setFieldErrors((prev) => ({
          ...prev,
          width: dimensionError,
          height: dimensionError,
        }));
        setError(dimensionError);
      }
    }
  };

  // 벽 높이 변경 처리 함수
  const handleWallHeightChange = (value: number | null) => {
    if (mode === 'pyeong') {
      return;
    }

    setLocalWallHeight(value);

    setFieldErrors((prev) => ({
      ...prev,
      wallHeight: '',
    }));
    setError('');

    if (
      value !== null &&
      (attemptedSubmit || value <= 0 || value > 3.0 || value < 2.0)
    ) {
      const wallHeightError = validateWallHeight(value);
      if (wallHeightError) {
        setFieldErrors((prev) => ({
          ...prev,
          wallHeight: wallHeightError,
        }));
        setError(wallHeightError);
      }
    }
  };

  // 입력 필드 포커스 시 처리
  const handleFieldFocus = (_field: keyof FieldErrors) => {
    // 포커스 시 별도 처리 없음 (폼 제출 시에만 검증)
  };

  const handleSubmit = () => {
    setAttemptedSubmit(true);

    if (mode === 'pyeong' && localWallHeight === null) {
      setLocalWallHeight(2.5);
    }

    const validation = validateRoomSizeForm(
      mode,
      localPyeong,
      localWidth,
      localHeight,
      mode === 'pyeong' ? 2.5 : localWallHeight,
    );

    if (!validation.isValid) {
      setError(validation.error);
      setFieldErrors((prev) => ({
        ...prev,
        ...validation.fieldErrors,
      }));
      return false;
    }

    if (mode === 'pyeong' && localPyeong !== null) {
      setPyeong(localPyeong);
    } else if (
      localWidth !== null &&
      localHeight !== null &&
      localWallHeight !== null
    ) {
      setDimensions(localWidth, localHeight, localWallHeight);
    } else {
      return false;
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
    handleWidthChange,
    handleHeightChange,
    handleWallHeightChange,
    handleFieldFocus,
    handleSubmit,
  };
}
