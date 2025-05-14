'use client';

import { useViewStore } from '@/stores/useViewStore';

const VALID_ANGLES = [45, 135, 225, 315];

export default function CameraButtons() {
  const angle = useViewStore((s) => s.angle);
  const setAngle = useViewStore((s) => s.setAngle);
  const lastNormalAngle = useViewStore((s) => s.lastNormalAngle);
  const setLastNormalAngle = useViewStore((s) => s.setLastNormalAngle);

  const handleRotate = () => {
    if (angle === -1) {
      const currentIndex = VALID_ANGLES.indexOf(lastNormalAngle);
      const nextIndex = (currentIndex + 1) % VALID_ANGLES.length;
      const newAngle = VALID_ANGLES[nextIndex];
      setLastNormalAngle(newAngle);
      return;
    }

    const currentIndex = VALID_ANGLES.indexOf(angle);
    const nextIndex = (currentIndex + 1) % VALID_ANGLES.length;
    const newAngle = VALID_ANGLES[nextIndex];
    setAngle(VALID_ANGLES[nextIndex]);
    setLastNormalAngle(newAngle);
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
        onClick={() => {
          if (angle === -1) {
            setAngle(lastNormalAngle);
          } else {
            setLastNormalAngle(angle);
            setAngle(-1);
          }
        }}
        className='px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-lg'
      >
        {angle === -1 ? '🔄 3D 뷰' : '🔼 탑 뷰'}
      </button>
    </div>
  );
}
