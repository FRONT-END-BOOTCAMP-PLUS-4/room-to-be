'use client';

import { useFurnitureStore } from '@/stores/useFurnitureStore';
import FurnitureSizeInput from './FurnitureSizeInput';
import { Slider } from '@/components/ui/slider';

export default function FurnitureController() {
  const { selectedFurniture, updateSelectedFurniture } = useFurnitureStore();

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

  return (
    <div className='w-[219px] px-[30px] py-[40px] rounded-[30px] bg-gradient-to-r from-black/0 to-black/10 shadow-[0_0_15px_#00000026] flex flex-col items-center justify-center gap-4'>
      <div>컨트롤러</div>

      {selectedFurniture && (
        <>
          <div className='mb-4'>
            <div className='text-lg font-semibold mb-2'>
              {selectedFurniture.name}
            </div>
            <img
              src={selectedFurniture.thumbnailUrl}
              alt='썸네일'
              className='w-24 h-24 object-contain mx-auto'
            />
          </div>

          {scaleInputs.map(({ label, key, scaleKey, originalKey }) => {
            const baseValue = selectedFurniture[key];
            const originalValue = selectedFurniture[originalKey];

            const isModified = baseValue !== originalValue;
            const displayValue = isModified ? baseValue : originalValue;

            const handleChange = (val: number) => {
              const { [originalKey]: originalValue, originalScale } =
                selectedFurniture;
              const newScale = (val / originalValue) * originalScale;

              updateSelectedFurniture({
                [key]: val,
                [scaleKey]: newScale,
              });
            };

            return (
              <div key={key} className='w-full'>
                <FurnitureSizeInput
                  label={label}
                  value={displayValue}
                  onChange={handleChange}
                />
                <Slider
                  value={[displayValue]}
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
      )}
    </div>
  );
}
