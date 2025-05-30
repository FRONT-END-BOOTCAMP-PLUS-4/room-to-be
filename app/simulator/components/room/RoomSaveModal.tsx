'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { v4 as uuid } from 'uuid';

import BoxTextButton from '@/app/components/buttons/BoxTextButton';
import { PlacedFurnitureInput } from '@/app/types/rooms';

import { uploadRoomThumbnail } from '@/utils/SupabaseStorageUploader';

import { saveRoom } from '@/apis/rooms';
import { useBackgroundStore } from '@/stores/useBackgroundStore';
import { useCameraStore } from '@/stores/useCameraStore';
import { useLightingStore } from '@/stores/useLightingStore';

interface RoomSaveModalProps {
  onClose: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  furnitures: PlacedFurnitureInput[];
  width: number;
  height: number;
}

export default function RoomSaveModal({
  onClose,
  canvasRef,
  furnitures,
  width,
  height,
}: RoomSaveModalProps) {
  const [roomName, setRoomName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const userId = useSession().data?.user?.id;

  const handleSave = async () => {
    if (!roomName.trim()) {
      alert('방 이름을 입력해주세요.');
      return;
    }
    if (!userId) {
      alert('로그인이 필요합니다.');
      return;
    }

    setIsSaving(true);
    const roomId = uuid();
    const background = useBackgroundStore.getState().currentBackgroundId;
    const isNight = !useLightingStore.getState().isDay;
    const cameraPosition = useCameraStore.getState().position;
    try {
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvasRef.current?.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error('캔버스 캡처 실패'));
        }, 'image/png');
      });

      const thumbnailUrl = await uploadRoomThumbnail(blob, roomId);

      await saveRoom({
        id: roomId,
        name: roomName,
        width,
        height,
        thumbnailUrl,
        userId: userId,
        furnitures,
        background,
        isNightMode: isNight,
        cameraX: cameraPosition[0],
        cameraY: cameraPosition[1],
        cameraZ: cameraPosition[2],
      });

      alert('방이 성공적으로 저장되었습니다.');
      onClose();
      await new Promise((res) => setTimeout(res, 300));
      router.push('/list');
    } catch (error) {
      console.error('방 저장 실패:', error);
      alert('방 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <div className='bg-[#444] rounded-2xl p-6 w-[320px]'>
        <p className='text-white text-center mb-4'>방 이름을 입력해 주세요.</p>
        <input
          type='text'
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className='w-full mb-4 p-2 rounded bg-gray-500 text-white placeholder:text-gray-300'
          placeholder='예: 우리 집'
          disabled={isSaving}
        />
        <BoxTextButton
          showImg={false}
          onClick={handleSave}
          className='w-full'
          disabled={isSaving}
        >
          {isSaving ? '저장 중...' : '방 저장하기'}
        </BoxTextButton>
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-white text-xl'
        ></button>
      </div>
    </div>
  );
}
