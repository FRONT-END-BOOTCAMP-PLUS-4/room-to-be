import Image from 'next/image';

import ListItem from './ListItem';

interface ListProps {
  imageUrl: string;
  alt?: string;
  title?: string;
}

export default function List({ imageUrl, alt = '', title }: ListProps) {
  return (
    <ListItem
      as='li'
      className='w-full max-w-[400px] aspect-[10/7] group relative'
    >
      <Image src={imageUrl} alt={alt} fill className='object-cover' />
      <div
        className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500  cursor-pointer'
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)',
        }}
      ></div>

      <div className='absolute bottom-4 left-6 text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 cursor-pointer'>
        {title}
      </div>
    </ListItem>
  );
}
