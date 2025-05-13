'use client';

import { useViewStore } from '@/stores/useViewStore';

const VALID_ANGLES = [45, 135, 225, 315];

export default function CameraButtons() {
  const angle = useViewStore((s) => s.angle);
  const setAngle = useViewStore((s) => s.setAngle);

  const handleRotate = () => {
    const currentIndex = VALID_ANGLES.indexOf(angle);
    const nextIndex = (currentIndex + 1) % VALID_ANGLES.length;
    setAngle(VALID_ANGLES[nextIndex]);
  };

  return (
    <div className='absolute top-4 right-4 z-10 flex gap-2 bg-black/90 text-white px-4 py-3 rounded-md shadow-lg'>
      <button
        onClick={handleRotate}
        className='px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-lg'
      >
        ↩ 회전
      </button>
      <button
        onClick={() => setAngle(-1)} // 탑뷰
        className='px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-lg'
      >
        🔼 탑 뷰
      </button>
    </div>
  );
}
