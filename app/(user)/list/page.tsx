'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

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
  const session = useSession();
  const userId = session.data?.user?.id;

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
      <Header />

      <div className='absolute top-[320px] left-0 w-full z-10'>
        <div className='bg-white rounded-t-[28px] pt-10 overflow-hidden'>
          <div className='container mx-auto px-7'>
            {!isLoading && (
              <>
                {rooms.length > 0 && <RoomCount count={rooms.length} />}
                <RoomList rooms={rooms} setRooms={setRooms} />
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
