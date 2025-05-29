'use client';

import { useEffect, useState } from 'react';

import Loading from '@/app/components/loading/Loading';

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
  const [imagesLoaded, setImagesLoaded] = useState(0);
  // 나중에 수정해
  const userId = '2';

  useEffect(() => {
    async function fetchRooms() {
      const res = await fetch(`/api/rooms?userId=${userId}`);
      const data = await res.json();
      setRooms(data.rooms);
    }
    fetchRooms();
  }, [userId]);

  
  useEffect(() => {
    if (rooms.length > 0 && imagesLoaded === rooms.length) {
      setIsLoading(false);
    }
  }, [imagesLoaded, rooms.length]);

  return (
    <>
      {isLoading && <Loading />}

      <div className='relative'>
        <Header userId={userId} />

        <div className='absolute top-[320px] left-0 w-full z-10'>
          <div className='bg-white rounded-t-[28px] pt-10 overflow-hidden'>
            <div className='container mx-auto px-7'>
              {rooms.length > 0 && (
                <>
                  <RoomCount count={rooms.length} />
                  <RoomList
                    rooms={rooms}
                    setRooms={setRooms}
                    onImageLoad={() => setImagesLoaded((prev) => prev + 1)}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
