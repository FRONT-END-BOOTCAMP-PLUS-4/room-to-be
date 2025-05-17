'use client';

import { Slider } from '@/components/ui/slider';
import FurnitureSizeInput from './FurnitureSizeInput';

const scaleInputs = [
  {
    label: '가로',
    key: 'baseX',
    scaleKey: 'scaleX',
    originalBaseKey: 'originalBaseX',
    originalScaleKey: 'originalScaleX',
  },
  {
    label: '세로',
    key: 'baseZ',
    scaleKey: 'scaleZ',
    originalBaseKey: 'originalBaseZ',
    originalScaleKey: 'originalScaleZ',
  },
  {
    label: '높이',
    key: 'baseY',
    scaleKey: 'scaleY',
    originalBaseKey: 'originalBaseY',
    originalScaleKey: 'originalScaleY',
  },
] as const;

interface UnlockedScaleInputsProps {
  furniture: any;
  onChange: (updates: Record<string, number>) => void;
}

export default function UnlockedScaleInputs({
  furniture,
  onChange,
}: UnlockedScaleInputsProps) {
  return (
    <>
      {scaleInputs.map(({ label, key, scaleKey, originalBaseKey, originalScaleKey }) => {
        const baseValue = furniture[key];
        const originalBaseValue = furniture[originalBaseKey];
        const originalScaleValue = furniture[originalScaleKey];

        const isModified = baseValue !== originalBaseValue;
        const displayValue = isModified ? baseValue : originalBaseValue;

        const handleChange = (val: number) => {
          const newBase = Math.round(val);
          const newScale = (val / originalBaseValue) * originalScaleValue;

          onChange({
            [key]: newBase,
            [scaleKey]: newScale,
          });
        };

        return (
          <div key={key} className='w-full'>
            <FurnitureSizeInput
              label={label}
              value={Math.round(displayValue)}
              onChange={handleChange}
            />
            <Slider
              value={[Math.round(displayValue)]}
              min={10}
              max={3000}
              step={1}
              onValueChange={([val]) => handleChange(val)}
              className='mt-2 mb-2'
            />
          </div>
        );
      })}
    </>
  );
}