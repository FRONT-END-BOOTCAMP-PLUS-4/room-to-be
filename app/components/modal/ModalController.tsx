'use client';

import { useState } from 'react';

import InteriorStartModal from './InteriorStartModal';
import TemplateSelectModal from './TemplateSelectModal';
import RoomSizeModal from './RoomSizeModal';

type ModalType = 'start' | 'template' | 'roomSize';

export default function ModalController() {
  const [currentModal, setCurrentModal] = useState<ModalType>('start');

  return (
    <>
      {currentModal === 'start' && (
        <InteriorStartModal
          onSelectTemplate={() => setCurrentModal('template')}
          onSelectRoomSize={() => setCurrentModal('roomSize')}
        />
      )}

      {currentModal === 'template' && (
        <TemplateSelectModal onBack={() => setCurrentModal('start')} />
      )}

      {currentModal === 'roomSize' && (
        <RoomSizeModal onBack={() => setCurrentModal('start')} />
      )}
    </>
  );
}
