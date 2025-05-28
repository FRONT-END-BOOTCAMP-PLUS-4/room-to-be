'use client';

import { useEffect, useState } from 'react';

import type { Furnitures } from '@/app/types/furniture';

import { ScrollArea } from '@/components/ui/scroll-area';

import { useFurnitureStore } from '@/stores/useFurnitureStore';

import FurnitureGroupList from './FurnitureGroupList';
import FurnitureSearchInput from './FurnitureSearchInput';
import PlacementToggle from './PlacementToggle';

interface Props {
  fetchFurnitureByPlacementType: (
    type: 'wall' | 'floor',
  ) => Promise<Furnitures[]>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FurnitureSidebar({
  fetchFurnitureByPlacementType,
  isOpen,
  setIsOpen,
}: Props) {
  const [placementType, setPlacementType] = useState<'wall' | 'floor'>('floor');
  const [search, setSearch] = useState('');
  const [furniture, setFurniture] = useState<Furnitures[]>([]);
  const addFurniture = useFurnitureStore((state) => state.addFurniture);
  const markRenderable = useFurnitureStore((state) => state.markRenderable);
  useEffect(() => {
    const fetch = async () => {
      const data = await fetchFurnitureByPlacementType(placementType);
      setFurniture(data);
    };
    fetch();
  }, [placementType]);

  const filteredFurniture = furniture.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );

  const grouped = filteredFurniture.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, Furnitures[]>,
  );

  return (
    <div
      className={`
        h-full bg-gradient-to-r from-white/10 to-black/20 backdrop-blur-md shadow-[0_0_15px_#00000026] p-4 text-white transition-transform duration-300
        rounded-tr-2xl rounded-br-2xl w-80 absolute left-0 top-0 z-20
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* 로고 */}
      <div className='mb-3'>
        <img
          src='/assets/icons/roomtobe-logo.svg'
          alt='RoomToBe Logo'
          className='w-20 h-auto ml-1'
        />
      </div>

      <FurnitureSearchInput value={search} onChange={setSearch} />
      <PlacementToggle value={placementType} onChange={setPlacementType} />

      <ScrollArea className='h-[calc(100vh-180px)] pr-2'>
        <FurnitureGroupList
          grouped={grouped}
          onSelect={(info) => {
            addFurniture(info);
            setTimeout(() => {
              markRenderable(info.id);
            }, 200); // GLTF 안정화 시간
          }}
        />
      </ScrollArea>
    </div>
  );
}
