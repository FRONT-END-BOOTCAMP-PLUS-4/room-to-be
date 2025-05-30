export default function RoomCount({ count }: { count: number }) {
  return (
    <div className='flex items-center gap-2 mb-4 text-gray-700 text-lg font-medium'>
      <img
        src='/assets/icons/list-icon.svg'
        alt='grid icon'
        className='w-5 h-5'
      />
      <span className='text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500'>
        {count}
      </span>
    </div>
  );
}
