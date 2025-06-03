'use client';

import { useState } from 'react';
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
  expandedCategory: string | null;
  setExpandedCategory: (category: string | null) => void;
}

export default function FurnitureGroupList({
  grouped,
  onSelect,
  expandedCategory,
  setExpandedCategory,
}: Props) {
  const [isCreating, setIsCreating] = useState(false);

  const handleClick = async (item: Furnitures) => {
    if (isCreating) return;
    setIsCreating(true);
    await onSelect({
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
    });
    setTimeout(() => setIsCreating(false), 500);
  };

  const renderItems = (items: Furnitures[]) => (
    <div className='grid grid-cols-3 gap-2'>
      {items.map((item) => (
        <div
          key={item.id}
          className={`
            bg-white rounded-md overflow-hidden aspect-square cursor-pointer
            transition-transform transform hover:scale-[1.05] hover:brightness-110
            ${isCreating ? 'pointer-events-none opacity-50' : ''}
          `}
          onClick={() => handleClick(item)}
        >
          <img
            src={item.thumbnailUrl}
            alt={item.name}
            className='object-cover w-full h-full'
          />
        </div>
      ))}
    </div>
  );

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
        {renderItems(items)}
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
          {renderItems(items.slice(0, 3))}
        </div>
      ))}
    </>
  );
}
