import Image from 'next/image';

import ListItem from './ListItem';

interface TemplateListProps {
  imageUrl?: string;
  alt?: string;
}

export default function TemplateList({
  imageUrl = '/assets/images/room01.jpg',
  alt = '',
}: TemplateListProps) {
  return (
    <ListItem
      as='article'
      className='w-[360px] h-[252px] aspect-auto group relative'
    >
      <Image src={imageUrl} alt={alt} fill className='object-cover' />
      <div className='absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300'></div>

      <div className='absolute inset-0 flex items-center justify-center'>
        <button className='px-6 py-3 bg-white bg-opacity-20 rounded-[10px] text-white border border-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center hover:bg-opacity-30 z-50 relative'>
          템플릿 적용하기
        </button>
      </div>
    </ListItem>
  );
}
