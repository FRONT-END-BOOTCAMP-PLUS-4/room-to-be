'use client';

import { useFurnitureStore } from '@/stores/useFurnitureStore';
import FurnitureSizeInput from './FurnitureSizeInput';

export default function FurnitureController() {
  const { selectedFurniture, updateSelectedFurniture } = useFurnitureStore();

  const scaleInputs = [
    { label: '가로', key: 'scaleX' },
    { label: '세로', key: 'scaleZ' },
    { label: '높이', key: 'scaleY' },
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
          {scaleInputs.map(({ label, key }) => (
            <FurnitureSizeInput
              key={key}
              label={label}
              value={selectedFurniture[key] * 1000}
              onChange={(val) =>
                updateSelectedFurniture({ [key]: val / 1000 })
              }
            />
          ))}
        </>
      )}
    </div>
  );
}