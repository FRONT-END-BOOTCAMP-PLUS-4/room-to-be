import type { Furnitures } from '@/app/types/furniture';

import { Button } from '@/components/ui/button';

import FurnitureThumbnail from './FurnitureThumbnail';

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
  expandedCategory: string | null;
  setExpandedCategory: (category: string | null) => void;
}

export default function FurnitureGroupList({
  grouped,
  onSelect,
  expandedCategory,
  setExpandedCategory,
}: Props) {
  if (expandedCategory) {
    const items = grouped[expandedCategory] ?? [];

    return (
      <div className='mb-6'>
        <div className='flex justify-between items-center mb-2'>
          <span className='text-sm font-semibold'>{expandedCategory}</span>
          <Button
            variant='link'
            className='text-xs text-white/70 px-0 h-auto'
            onClick={() => setExpandedCategory(null)}
          >
            ← Back
          </Button>
        </div>

        <div className='grid grid-cols-3 gap-2'>
          {items.map((item) => (
            <FurnitureThumbnail key={item.id} item={item} onSelect={onSelect} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className='mb-6'>
          <div className='flex justify-between items-center mb-2'>
            <span className='text-sm font-semibold'>{category}</span>
            <Button
              variant='link'
              className='text-xs text-white/70 px-0 h-auto'
              onClick={() => setExpandedCategory(category)}
            >
              See All
            </Button>
          </div>

          <div className='grid grid-cols-3 gap-2 p-1'>
            {items.slice(0, 3).map((item) => (
              <FurnitureThumbnail
                key={item.id}
                item={item}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
