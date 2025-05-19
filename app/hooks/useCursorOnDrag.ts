import { useEffect } from 'react';

// 드래그 상태에 따라 마우스 커서 변경하는 훅
export default function useCursorOnDrag(
  isDragging: boolean,
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>,
) {
  useEffect(() => {
    // 마우스 드래그 중이었을 때, 마우스 버튼 떼면 커서 기본 값으로 복원
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        document.body.style.cursor = 'auto';
      }
    };
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, setIsDragging]);
}
