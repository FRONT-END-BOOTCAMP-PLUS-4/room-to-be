'use client';

import { useEffect, useState } from 'react';

import Header from './components/Header';
import RoomCount from './components/RoomCount';
import RoomList from './components/RoomList';

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

  // 나중에 민혁이 Auth코드 연동할때 수정해야해 userId= 1 은 방 6개 userId = 2는 방 0개
  const userId = '2';

  useEffect(() => {
    async function fetchRooms() {
      const res = await fetch(`/api/rooms?userId=${userId}`);
      const data = await res.json();
      setRooms(data.rooms);
      setIsLoading(false);
    }
    fetchRooms();
  }, [userId]);

  return (
    <div className='relative'>
      <Header userId={userId} />

      {/* 하얀 박스는 absolute로 고정 배치 */}
      <div className='absolute top-[320px] left-0 w-full z-10'>
        <div className='bg-white rounded-t-[28px] pt-10 overflow-hidden'>
          <div className='container mx-auto px-7'>
            {!isLoading && (
              <>
                {rooms.length > 0 && <RoomCount count={rooms.length} />}
                <RoomList rooms={rooms} />
              </>
            )}

            {isLoading && (
              <p className='text-center text-gray-400 text-sm'>
                방을 불러오는 중...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
