// useRoomSizeForm.ts
import { useState, useEffect } from 'react';
import {
  useRoomSizeStore,
  pyeongToRoomDimensions,
} from '@/stores/useRoomSizeStore';
import {
  validatePyeong,
  validateDimension,
  validateWallHeight,
  validateRoomSizeForm,
} from '@/utils/roomSizeValidators';
import { FieldErrors } from '@/utils/roomSizeConstants';

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

  // 모드 전환 시 상태 업데이트
  useEffect(() => {
    handleModeChange();
  }, [mode]);

  // 모드 변경 핸들러
  const handleModeChange = () => {
    // 모드 전환 시 모든 에러 초기화
    setError('');
    setFieldErrors({
      pyeong: '',
      width: '',
      height: '',
      wallHeight: '',
    });

    if (mode === 'pyeong') {
      // 평수 모드로 전환
      if (localWidth && localHeight) {
        const area = localWidth * localHeight;
        const calculatedPyeong = Math.round((area / 3.3058) * 100) / 100;

        // 계산된 평수가 제한 범위를 벗어나면 조정
        const validPyeong = Math.min(Math.max(calculatedPyeong, 1), 10);
        setLocalPyeong(validPyeong);
      }
    } else {
      // 미터 모드로 전환
      if (localPyeong) {
        const dimensions = pyeongToRoomDimensions(localPyeong);
        setLocalWidth(dimensions.width);
        setLocalHeight(dimensions.height);
      }
    }
  };

  // 평수 변경 처리 함수
  const handlePyeongChange = (value: number | null) => {
    setLocalPyeong(value);

    if (value === null) {
      setFieldErrors((prev) => ({
        ...prev,
        pyeong: '',
      }));
      setError('');
      return;
    }

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
  const handleDimensionChange = (
    type: 'width' | 'height',
    value: number | null,
  ) => {
    if (type === 'width') {
      setLocalWidth(value);
    } else {
      setLocalHeight(value);
    }

    // 값이 null이면 에러를 표시하지 않음
    if (value === null) {
      setFieldErrors((prev) => ({
        ...prev,
        [type]: '',
      }));

      // 다른 필드에도 에러가 없으면 전체 에러 메시지 제거
      if (
        (type === 'width' && !fieldErrors.height) ||
        (type === 'height' && !fieldErrors.width)
      ) {
        setError('');
      }
      return;
    }

    const newWidth = type === 'width' ? value : localWidth;
    const newHeight = type === 'height' ? value : localHeight;

    // 둘 중 하나라도 null이면 검증하지 않음
    if (newWidth === null || newHeight === null) {
      return;
    }

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
  const handleWallHeightChange = (value: number | null) => {
    setLocalWallHeight(value);

    if (value === null) {
      setFieldErrors((prev) => ({
        ...prev,
        wallHeight: '',
      }));
      setError('');
      return;
    }

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
    if (field === 'pyeong' && localPyeong !== null) {
      const pyeongError = validatePyeong(localPyeong);
      if (pyeongError) {
        setError(pyeongError);
      }
    } else if (
      (field === 'width' || field === 'height') &&
      localWidth !== null &&
      localHeight !== null
    ) {
      const dimensionError = validateDimension(localWidth, localHeight);
      if (dimensionError) {
        setError(dimensionError);
      }
    } else if (field === 'wallHeight' && localWallHeight !== null) {
      const wallHeightError = validateWallHeight(localWallHeight);
      if (wallHeightError) {
        setError(wallHeightError);
      }
    }
  };

  // 폼 제출 처리
  const handleSubmit = () => {
    const validation = validateRoomSizeForm(
      mode,
      localPyeong,
      localWidth,
      localHeight,
      localWallHeight,
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
    handleDimensionChange,
    handleWallHeightChange,
    handleFieldFocus,
    handleSubmit,
  };
}
