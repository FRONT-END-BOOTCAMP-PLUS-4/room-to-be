'use client';

import { useViewStore } from '@/stores/useViewStore';

const VALID_ANGLES = [45, 135, 225, 315];
const TOP_VIEW_ANGLES = [0, 90, 180, 270];

function convertForm3DToTop(angle3D: number): number {
  const index3D = VALID_ANGLES.indexOf(angle3D);
  if (index3D !== -1) {
    return TOP_VIEW_ANGLES[index3D];
  }
  return 0;
}

function convertFormTopTo3D(angleTop: number): number {
  const indexTop = TOP_VIEW_ANGLES.indexOf(angleTop);
  if (indexTop !== -1) {
    return VALID_ANGLES[indexTop];
  }

  return 45;
}

export default function CameraButtons() {
  const angle = useViewStore((s) => s.angle);
  const setAngle = useViewStore((s) => s.setAngle);
  const isTopView = useViewStore((s) => s.isTopView);
  const setIsTopView = useViewStore((s) => s.setIsTopView);

  const currentAngles = isTopView ? TOP_VIEW_ANGLES : VALID_ANGLES;

  const handleRotate = () => {
    const currentIndex = currentAngles.indexOf(angle);
    const nextIndex = (currentIndex + 1) % currentAngles.length;
    const newAngle = currentAngles[nextIndex];
    setAngle(newAngle);
  };

  const toggleView = () => {
    if (isTopView) {
      const new3DAngle = convertFormTopTo3D(angle);
      setAngle(new3DAngle);
      setIsTopView(false);
    } else {
      const newTopAngle = convertForm3DToTop(angle);
      setAngle(newTopAngle);
      setIsTopView(true);
    }
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
        onClick={toggleView}
        className='px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-lg'
      >
        {isTopView ? '🔄 3D 뷰' : '🔼 탑 뷰'}
      </button>
    </div>
  );
}
