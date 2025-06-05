import { useEffect } from 'react';

// 드래그 상태에 따라 마우스 커서만 변경하는 훅 -> 드래그 상태는 건드리지 않게 수정
export default function useCursorOnDrag(isDragging: boolean) {
  useEffect(() => {
    const handleMouseUp = () => {
      if (isDragging) {
        document.body.style.cursor = 'auto'; // 커서만 초기화
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);
}
