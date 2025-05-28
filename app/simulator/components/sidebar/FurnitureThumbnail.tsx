import { v4 as uuidv4 } from 'uuid';

import type { Furnitures } from '@/app/types/furniture';

interface Props {
  item: Furnitures;
  onSelect: (furniture: {
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

export default function FurnitureThumbnail({ item, onSelect }: Props) {
  return (
    <div
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
  );
}
