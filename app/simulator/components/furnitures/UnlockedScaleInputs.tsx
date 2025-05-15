'use client';

import { Slider } from '@/components/ui/slider';
import FurnitureSizeInput from './FurnitureSizeInput';

const scaleInputs = [
  {
    label: '가로',
    key: 'baseX',
    scaleKey: 'scaleX',
    originalKey: 'originalBaseX',
  },
  {
    label: '세로',
    key: 'baseZ',
    scaleKey: 'scaleZ',
    originalKey: 'originalBaseZ',
  },
  {
    label: '높이',
    key: 'baseY',
    scaleKey: 'scaleY',
    originalKey: 'originalBaseY',
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
      {scaleInputs.map(({ label, key, scaleKey, originalKey }) => {
        const baseValue = furniture[key];
        const originalValue = furniture[originalKey];
        const isModified = baseValue !== originalValue;
        const displayValue = isModified ? baseValue : originalValue;

        const handleChange = (val: number) => {
          const newScale = (val / originalValue) * furniture.originalScale;
          onChange({ [key]: Math.round(val), [scaleKey]: newScale });
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
              className='mt-2'
            />
          </div>
        );
      })}
    </>
  );
}
