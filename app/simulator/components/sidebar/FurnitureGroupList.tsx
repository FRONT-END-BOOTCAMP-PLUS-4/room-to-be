import { v4 as uuidv4 } from 'uuid';

import type { Furnitures } from '@/app/types/furniture';

import { Button } from '@/components/ui/button';

interface Props {
  grouped: Record<string, Furnitures[]>;
  onSelect: (item: {
    id: string;
    furnitureId: string;
    name: string;
    category: string;
    thumbnailUrl: string;
    modelUrl: string;
    positionX: number;
    positionY: number;
    positionZ: number;
    rotationY: number;
    scaleX: number;
    scaleY: number;
    scaleZ: number;
    placementType: 'wall' | 'floor';
  }) => void;
}

export default function FurnitureGroupList({ grouped, onSelect }: Props) {
  return (
    <>
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className='mb-6'>
          <div className='flex justify-between items-center mb-2'>
            <span className='text-sm font-semibold'>{category}</span>
            <Button
              variant='link'
              className='text-xs text-white/70 px-0 h-auto'
            >
              See All
            </Button>
          </div>

          <div className='grid grid-cols-3 gap-2'>
            {items.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className='bg-white rounded-md overflow-hidden aspect-square cursor-pointer'
                onClick={() =>
                  onSelect({
                    id: uuidv4(),
                    furnitureId: item.id,
                    name: item.name,
                    category: item.category,
                    thumbnailUrl: item.thumbnailUrl,
                    modelUrl: item.modelUrl,
                    positionX: Math.random() * 2 + 1,
                    positionY: 0,
                    positionZ: Math.random() * 2 + 1,
                    rotationY: 0,
                    scaleX: item.scaleX,
                    scaleY: item.scaleY,
                    scaleZ: item.scaleZ,
                    placementType: item.placementType as 'wall' | 'floor',
                  })
                }
              >
                <img
                  src={item.thumbnailUrl}
                  alt={item.name}
                  className='object-cover w-full h-full'
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
