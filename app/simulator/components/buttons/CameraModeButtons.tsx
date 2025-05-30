'use client';

import { useViewStore } from '@/stores/useViewStore';

import FurnitureControllerBtn from '../furnitures/FurnitureControllerBtn';

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

export default function CameraModeButtons() {
  const angle = useViewStore((s) => s.angle);
  const setAngle = useViewStore((s) => s.setAngle);
  const isTopView = useViewStore((s) => s.isTopView);
  const setIsTopView = useViewStore((s) => s.setIsTopView);

  // 방 회전
  const handleRoomRotate = () => {
    const currentAngles = isTopView ? TOP_VIEW_ANGLES : VALID_ANGLES;
    const currentIndex = currentAngles.indexOf(angle);
    const nextIndex = (currentIndex + 1) % currentAngles.length;
    const newAngle = currentAngles[nextIndex];
    setAngle(newAngle);
  };

  // 뷰 모드 전환
  const handleViewToggle = () => {
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
    <div
      className='w-[200px] flex gap-[10px] px-[30px] py-[10px] rounded-[15px]
        bg-gradient-to-r from-white/10 to-black/20 h-full
        backdrop-blur-md shadow-[0_0_15px_#00000026]
        items-center
        transition-[max-width] duration-400 ease-in-out
        overflow-hidden'
    >
      <FurnitureControllerBtn
        width={14}
        height={14}
        icon='/assets/icons/view-mode.svg'
        onClick={handleRoomRotate}
      />
      <FurnitureControllerBtn
        text={isTopView ? '3D 뷰' : '탑 뷰'}
        onClick={handleViewToggle}
      />
    </div>
  );
}
