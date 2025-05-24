'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import type { Furnitures } from '@/app/types/furniture';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

import { useFurnitureStore } from '@/stores/useFurnitureStore';

import FurnitureGroupList from './FurnitureGroupList';
import FurnitureSearchInput from './FurnitureSearchInput';
import PlacementToggle from './PlacementToggle';

interface Props {
  fetchFurnitureByPlacementType: (
    type: 'wall' | 'floor',
  ) => Promise<Furnitures[]>;
}

export default function FurnitureSidebar({
  fetchFurnitureByPlacementType,
}: Props) {
  const [placementType, setPlacementType] = useState<'wall' | 'floor'>('floor');
  const [search, setSearch] = useState('');
  const [furniture, setFurniture] = useState<Furnitures[]>([]);
  const [isOpen, setIsOpen] = useState(true);

  const addFurniture = useFurnitureStore((state) => state.addFurniture);

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
    <div className='relative h-full'>
      {/* 사이드바 본체 */}
      <div
        className={`h-full bg-gradient-to-r from-white/10 to-black/20 backdrop-blur-md shadow-[0_0_15px_#00000026] p-4 text-white transition-transform duration-300
        rounded-tr-2xl rounded-br-2xl w-80 absolute left-0 top-0 z-20 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
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
          <FurnitureGroupList grouped={grouped} onSelect={addFurniture} />
        </ScrollArea>
      </div>

      {/* 열고닫기 토글 버튼 */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant='ghost'
        size='icon'
        className={`
          absolute top-1/2 left-80 -translate-y-1/2 z-30
          bg-white/20 backdrop-blur-sm text-white
          border border-white/30 shadow-md hover:bg-white/30
          transition-all rounded-full w-8 h-8
          ${isOpen ? '' : '-translate-x-80'}
        `}
      >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </Button>
    </div>
  );
}
