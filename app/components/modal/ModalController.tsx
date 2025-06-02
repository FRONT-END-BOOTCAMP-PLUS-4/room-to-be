'use client';

import { useState } from 'react';

import InteriorStartModal from './InteriorStartModal';
import RoomSizeModal from './RoomSizeModal';
import TemplateSelectModal from './TemplateSelectModal';

type ModalType = 'start' | 'template' | 'roomSize';

interface ModalControllerProps {
  onClose?: () => void;
}

export default function ModalController({ onClose }: ModalControllerProps) {
  const [currentModal, setCurrentModal] = useState<ModalType>('start');

  return (
    <>
      {currentModal === 'start' && (
        <InteriorStartModal
          onSelectTemplate={() => setCurrentModal('template')}
          onSelectRoomSize={() => setCurrentModal('roomSize')}
          onClose={onClose}
        />
      )}

      {currentModal === 'template' && (
        <TemplateSelectModal
          onBack={() => setCurrentModal('start')}
          onClose={onClose}
        />
      )}

      {currentModal === 'roomSize' && (
        <RoomSizeModal
          onBack={() => setCurrentModal('start')}
          onClose={onClose}
        />
      )}
    </>
  );
}
