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
  const userImageUrl = '/assets/icons/profile-rogo.svg';

  useEffect(() => {
    async function fetchRooms() {
      const res = await fetch('/api/rooms?userId=1');
      const data = await res.json();
      setRooms(data.rooms);
      setIsLoading(false);
    }
    fetchRooms();
  }, []);

  return (
    <div>
      <Header userImageUrl={userImageUrl} />
      <div className='relative z-10 bg-white rounded-t-[28px] -mt-[100px] pt-10'>
        <div className='container mx-auto px-7'>
          <RoomCount count={rooms.length} />
          <RoomList rooms={rooms} />
        </div>
      </div>
    </div>
  );
}
