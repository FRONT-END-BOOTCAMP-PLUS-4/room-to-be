'use client';

import { Slider } from '@/components/ui/slider';

interface LockedScaleSliderProps {
  furniture: any;
  onChange: (newValues: any) => void;
}

export default function LockedScaleSlider({
  furniture,
  onChange,
}: LockedScaleSliderProps) {
  const { originalBaseX, originalBaseY, originalBaseZ, originalScale, baseX } =
    furniture;

  const minRatio = Math.max(
    10 / originalBaseX,
    10 / originalBaseY,
    10 / originalBaseZ,
  );
  const maxRatio = Math.min(
    3000 / originalBaseX,
    3000 / originalBaseY,
    3000 / originalBaseZ,
  );

  const minBaseX = Math.round(originalBaseX * minRatio);
  const maxBaseX = Math.round(originalBaseX * maxRatio);

  return (
    <>
      <div className='flex'>
        <label className='text-[12px] text-white/70 pt-[6px] text-left w-full'>스케일</label>
      </div>
      <Slider
        value={[Math.round(baseX)]}
        min={minBaseX}
        max={maxBaseX}
        step={1} 
        className='mb-2'
        onValueChange={([val]) => {
          const scaleRatio = val / originalBaseX;
          const newBaseX = Math.round(val);
          const newBaseY = Math.round(originalBaseY * scaleRatio);
          const newBaseZ = Math.round(originalBaseZ * scaleRatio);

          const isValid =
            newBaseX >= 10 &&
            newBaseX <= 3000 &&
            newBaseY >= 10 &&
            newBaseY <= 3000 &&
            newBaseZ >= 10 &&
            newBaseZ <= 3000;

          if (!isValid) return;

          const newScale = scaleRatio * originalScale;

          onChange({
            baseX: newBaseX,
            baseY: newBaseY,
            baseZ: newBaseZ,
            scaleX: newScale,
            scaleY: newScale,
            scaleZ: newScale,
          });
        }}
      />
    </>
  );
}
