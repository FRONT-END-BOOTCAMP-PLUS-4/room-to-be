'use client';

import { useEffect, useState } from 'react';
import SavedRoomCard from '../../components/list/SavedRoomCard';
import ProfileButton from '@/app/components/buttons/ProfileButton';
import BoxTextButton from '@/app/components/buttons/BoxTextButton';
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
    <div>
      {/* 헤더 영역 */}
      <div
        className='w-full h-[400px] text-white relative 
  bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 
  bg-[length:200%_200%] animate-gradient-x px-8'
      >
        {/* 안의 컨텐츠는 위치 유지 */}
        <div className='absolute top-[15px] left-0 w-full flex justify-between items-center px-8'>
          <div className='text-2xl font-bold'>ROOM TOBE</div>
          <div className='space-x-4'>
            <button className='text-sm'>MY PAGE</button>
            <button className='text-sm'>LOGOUT</button>
          </div>
        </div>

        {/* 프로필 */}
        <div className='absolute top-[90px] left-1/2 transform -translate-x-1/2 flex flex-col items-center'>
          <ProfileButton imageSrc={userImageUrl} />
          <div className='text-lg font-medium mt-2'>받아올겨</div>
        </div>

        {/* 하단 버튼 */}
        <div className='absolute bottom-[120px] right-[40px]'>
          <BoxTextButton showImg={true} className='text-sm'>
            3D 인테리어하러가기
          </BoxTextButton>
        </div>
      </div>
      {/* 아래 하얀 배경 영역 시작 */}
      <div className='relative z-10 bg-white rounded-t-[28px] -mt-[100px] pt-10'>
        <div className='container mx-auto px-7'>
          {/* 그리드 아이콘 + 방 개수 */}
          <div className='flex items-center gap-2 mb-4 text-gray-700 text-lg font-medium'>
            <img
              src='/assets/icons/list-icon.svg'
              alt='grid icon'
              className='w-5 h-5'
            />
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500'>
              {rooms.length}
            </span>
          </div>

          {/* 카드 리스트 */}
          {isLoading ? (
            <p className='text-center text-gray-500 mt-10'>불러오는 중...</p>
          ) : rooms.length === 0 ? (
            <p className='text-center text-gray-500 mt-10'>
              저장된 방이 없습니다.
            </p>
          ) : (
            <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-[26px] gap-y-[48px]'>
              {rooms.map((room) => (
                <SavedRoomCard
                  key={room.id}
                  imageUrl={room.thumbnailUrl}
                  title={room.name}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
