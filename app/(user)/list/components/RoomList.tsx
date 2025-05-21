'use client';

import { useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

import SavedRoomCard from '@/app/components/list/SavedRoomCard';

interface Room {
  id: string;
  name: string;
  width: number;
  height: number;
  thumbnailUrl: string;
  userId: string;
  createdAt: string;
}

export default function RoomList({ rooms }: { rooms: Room[] }) {
  const [roomList, setRoomList] = useState<Room[]>(rooms);

  if (roomList.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center text-center mt-1 relative'>
        <Player
          autoplay
          loop
          src='/assets/images/furnitures_gradient_strong_gradient.json'
          style={{ height: '300px', width: '300px' }}
        />
        <p className='absolute top-[240px] text-sm text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500'>
          아직 아무 방도 없어요. 당신만의 공간을 채워보세요!
        </p>
        <div className='p-[2px] rounded-[10px] bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 inline-block'>
          <button className='w-full h-full bg-white rounded-[8px] px-8 py-3 text-sm flex items-center justify-center gap-2'>
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500'>
              3D 인테리어 하러가기
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-[26px] gap-y-[48px]'>
      {roomList.map((room) => (
        <SavedRoomCard
          key={room.id}
          roomId={room.id}
          imageUrl={room.thumbnailUrl}
          title={room.name}
          onDelete={() =>
            setRoomList((prev) => prev.filter((r) => r.id !== room.id))
          }
        />
      ))}
    </ul>
  );
}
