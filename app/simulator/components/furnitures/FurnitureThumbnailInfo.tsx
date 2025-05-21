'use client';

interface FurnitureThumbnailInfoProps {
  name: string;
  thumbnailUrl: string;
}

export default function FurnitureThumbnailInfo({
  name,
  thumbnailUrl,
}: FurnitureThumbnailInfoProps) {
  return (
    <div className='w-full flex flex-col items-center'>
      <div
        className='mb-2 text-sm font-semibold text-white/70 text-center w-full truncate'
        title={name}
      >
        {name}
      </div>
      <img
        src={thumbnailUrl}
        alt='썸네일'
        className='w-full h-auto rounded-[10px] object-contain'
      />
    </div>
  );
}
