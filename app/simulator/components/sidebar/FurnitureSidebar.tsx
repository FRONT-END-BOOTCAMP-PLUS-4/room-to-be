'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface Furniture {
  id: string;
  name: string;
  category: string;
  thumbnailUrl: string;
  placementType: 'wall' | 'floor';
}

interface Props {
  fetchFurnitureByPlacementType: (
    type: 'wall' | 'floor',
  ) => Promise<Furniture[]>;
}

export default function FurnitureSidebar({
  fetchFurnitureByPlacementType,
}: Props) {
  const [placementType, setPlacementType] = useState<'wall' | 'floor'>('floor');
  const [search, setSearch] = useState('');
  const [furniture, setFurniture] = useState<Furniture[]>([]);
  const [isOpen, setIsOpen] = useState(true);

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
    {} as Record<string, Furniture[]>,
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
        {/* 검색창 */}
        <input
          placeholder='가구 검색'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='
    w-full mb-6 bg-white/30 text-white placeholder:text-white/70 border border-white 
    px-3 py-2 rounded-md leading-none transition
    focus:outline-none focus:ring-0 focus:border-white focus:shadow-none 
    hover:bg-white/40 hover:border-white
  '
        />

        {/* PlacementType 토글 */}
        <ToggleGroup
          type='single'
          value={placementType}
          onValueChange={(val) => {
            if (val === 'wall' || val === 'floor') setPlacementType(val);
          }}
          className='mb-4 flex justify-start gap-2'
        >
          <ToggleGroupItem value='floor' asChild>
            <button className='h-[30px] w-[60px] text-white text-[11px] font-medium border border-white bg-white/30 rounded-md px-2 leading-none text-center hover:bg-white/40 hover:text-white data-[state=on]:bg-white/60 data-[state=on]:text-white transition'>
              바닥
            </button>
          </ToggleGroupItem>

          <ToggleGroupItem value='wall' asChild>
            <button className='h-[30px] w-[60px] text-white text-[11px] font-medium border border-white bg-white/30 rounded-md px-2 py-[1px] leading-none min-h-0 text-center hover:bg-white/40 hover:text-white data-[state=on]:bg-white/60 data-[state=on]:text-white transition'>
              벽
            </button>
          </ToggleGroupItem>
        </ToggleGroup>

        <ScrollArea className='h-[calc(100vh-180px)] pr-2'>
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
                    className='bg-white rounded-md overflow-hidden aspect-square'
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
