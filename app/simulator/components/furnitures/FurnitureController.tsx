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
    <div
      className='w-[219px] px-[30px] py-[40px] rounded-[30px]
bg-gradient-to-r from-white/10 to-black/20 backdrop-blur-md
shadow-[0_0_15px_#00000026] flex flex-col items-center justify-center gap-4'
    >
      <div>스위치들어갈공간</div>

      {selectedFurniture && (
        <>
          {/* 가구 정보 영역 */}
          <div className='w-full flex flex-col items-center'>
            <div
              className='mb-2 text-sm font-semibold text-white/70 text-center w-full truncate'
              title={selectedFurniture.name}
            >
              {selectedFurniture.name}
            </div>
            <img
              src={selectedFurniture.thumbnailUrl}
              alt='썸네일'
              className='w-full h-auto rounded-[10px] object-contain'
            />
          </div>

          {/* 가구 스케일 고정 박스 */}
          <div className='w-[159px] h-[28px] px-[10px] rounded-[8px] bg-white/30 flex items-center justify-between'>
            <input type='checkbox' className='w-4 h-4 cursor-pointer' />
            <span className='text-[12px] text-white'>크기 비율 유지</span>
          </div>

          {/* 가구 스케일 변경 */}
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
