'use client';

import { useState } from 'react';
import { useFurnitureStore } from '@/stores/useFurnitureStore';

import FurnitureThumbnailInfo from './FurnitureThumbnailInfo';
import ScaleLockToggle from './ScaleLockToggle';
import LockedScaleSlider from './LockedScaleSlider';
import UnlockedScaleInputs from './UnlockedScaleInputs';
import LightButton from '@/app/components/buttons/LightButton';
import DarkButton from '@/app/components/buttons/DarkButton';

export default function FurnitureController() {
  const { selectedFurniture, updateSelectedFurniture } = useFurnitureStore();
  const [isScaleLocked, setIsScaleLocked] = useState(false);
  const [isLight, setIsLight] = useState(true);

  return (
    <div className='w-[219px] px-[30px] py-[25px] rounded-[30px] bg-gradient-to-r from-white/10 to-black/20 backdrop-blur-md shadow-[0_0_15px_#00000026] flex flex-col items-center justify-center gap-4'>
      <div className='flex gap-[10px]'>
        <LightButton
          onClick={() => setIsLight(true)}
          isOn={isLight ? true : false}
        />
        <DarkButton
          onClick={() => setIsLight(false)}
          isOn={isLight ? false : true}
        />
      </div>

      {selectedFurniture && (
        <>
          <FurnitureThumbnailInfo
            name={selectedFurniture.name}
            thumbnailUrl={selectedFurniture.thumbnailUrl}
          />

          <ScaleLockToggle
            checked={isScaleLocked}
            onChange={setIsScaleLocked}
          />

          {isScaleLocked ? (
            <LockedScaleSlider
              furniture={selectedFurniture}
              onChange={updateSelectedFurniture}
            />
          ) : (
            <UnlockedScaleInputs
              furniture={selectedFurniture}
              onChange={updateSelectedFurniture}
            />
          )}
        </>
      )}
    </div>
  );
}
