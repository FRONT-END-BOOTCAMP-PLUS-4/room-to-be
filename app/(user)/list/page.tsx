'use client';

import { useEffect, useState } from 'react';
import SavedRoomCard from '../../components/list/SavedRoomCard';

interface Room {
  id: string;
  name: string;
  width: number;
  height: number;
  thumbnailUrl: string;
  userId: string;
  createdAt: string;
}

export default function Page() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRooms() {
      try {
        //지금은 1번 방만 -> 나중에 로그인한 유저 아이디로 받아와야합니당
        const res = await fetch('/api/rooms?userId=1');
        const data = await res.json();
        setRooms(data.rooms);
      } catch (error) {
        console.error('방 목록 가져오기 실패:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRooms();
  }, []);

  return (
    <div className='container mx-auto px-4'>
      {isLoading ? (
        <p className='text-center text-gray-500 mt-10'>불러오는 중...</p>
      ) : rooms.length === 0 ? (
        <p className='text-center text-gray-500 mt-10'>저장된 방이 없습니다.</p>
      ) : (
        <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-[26px] gap-y-[48px] p-4'>
          {rooms.map(
            (room) => (
              console.log('hi', room),
              (
                <SavedRoomCard
                  key={room.id}
                  imageUrl={room.thumbnailUrl}
                  title={room.name}
                />
              )
            ),
          )}
        </ul>
      )}
    </div>
  );
}
