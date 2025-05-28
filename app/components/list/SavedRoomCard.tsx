'use client';

import { useEffect, useRef, useState } from 'react';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { deleteRoomById } from '@/apis/rooms';

import OverflowMenu from '../overflowmenu/OverflowMenu';
import Card from './Card';

interface SavedRoomCardProps {
  roomId: string;
  imageUrl: string;
  alt?: string;
  title?: string;
  isPriority?: boolean;
  onDelete?: () => void;
}

export default function SavedRoomCard({
  roomId,
  imageUrl,
  alt = '',
  title,
  isPriority = false,
  onDelete,
}: SavedRoomCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cardRef = useRef<HTMLLIElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsHovered(false);
        setIsMenuOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setIsHovered(false);
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCardClick = () => {
    router.push(`/edit/${roomId}`);
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMenuOpen) {
      setIsMenuOpen(false);
      setIsHovered(false);
    } else {
      setIsMenuOpen(true);
      setIsHovered(true);
    }
  };

  return (
    <Card
      as='li'
      ref={cardRef}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        if (!isMenuOpen) {
          setIsHovered(false);
        }
      }}
      className={`
    w-full max-w-[400px] aspect-[10/7] group relative
    rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1
    transform transition-all duration-300 overflow-hidden
    ${isHovered || isMenuOpen ? 'active-card' : ''}
  `}
    >
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className='object-cover'
        sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
        priority={isPriority}
      />

      <div
        className={`absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 ${isHovered || isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
      >
        <div onClick={toggleMenu}>
          <OverflowMenu
            isOpen={isMenuOpen}
            setIsOpen={setIsMenuOpen}
            onDelete={async () => {
              try {
                await deleteRoomById(roomId); // 실제 삭제 API 호출
                onDelete?.(); // 부모에서 넘겨준 삭제 콜백 호출 (리스트에서 제거됨)
                alert('방이 삭제되었습니다');
              } catch (e) {
                alert('삭제에 실패했습니다');
              } finally {
                setIsMenuOpen(false);
              }
            }}
          />
        </div>
      </div>

      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 cursor-pointer ${isHovered || isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)',
        }}
      ></div>

      <div
        className={`absolute bottom-4 left-6 text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 cursor-pointer ${isHovered || isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
      >
        {title}
      </div>
    </Card>
  );
}
