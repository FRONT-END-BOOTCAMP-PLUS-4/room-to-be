'use client';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import Image from 'next/image';

import OverflowMenu from '../overflowmenu/OverflowMenu';

import Card from './Card';

interface SavedRoomCardProps {
  imageUrl: string;
  alt?: string;
  title?: string;
  isPriority?: boolean;
}

export default function SavedRoomCard({
  imageUrl,
  alt = '',
  title,
  isPriority = false,
}: SavedRoomCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cardRef = useRef<HTMLLIElement>(null);

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
      className={`w-full max-w-[400px] aspect-[10/7] group relative ${isHovered || isMenuOpen ? 'active-card' : ''}`}
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        if (!isMenuOpen) {
          setIsHovered(false);
        }
      }}
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
          <OverflowMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
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
