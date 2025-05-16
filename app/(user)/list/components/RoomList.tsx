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
  if (rooms.length === 0) {
    return (
      <p className='text-center text-gray-500 mt-10'>
        아직 아무 방도 없어요. 당신만의 공간을 채워보세요!
      </p>
    );
  }

  return (
    <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-[26px] gap-y-[48px]'>
      {rooms.map((room) => (
        <SavedRoomCard key={room.id} imageUrl={room.thumbnailUrl} title={room.name} />
      ))}
    </ul>
  );
}
