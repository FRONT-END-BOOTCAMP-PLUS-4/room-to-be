'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { deleteRoomThumbnail } from '@/backend/infra/db/supabase/SupabaseStorageRemover';

import BoxTextButton from '@/app/components/buttons/BoxTextButton';
import { PlacedFurnitureInput, RoomSaveRequest } from '@/app/types/rooms';

import { uploadRoomThumbnail } from '@/utils/SupabaseStorageUploader';

import { getRoomById, updateRoom } from '@/apis/rooms';
import { useBackgroundStore } from '@/stores/useBackgroundStore';
import { useCameraStore } from '@/stores/useCameraStore';
import { useLightingStore } from '@/stores/useLightingStore';

interface RoomEditModalProps {
  onClose: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  furnitures: PlacedFurnitureInput[];
  width: number;
  height: number;
  userId: string;
  roomId: string;
}

export default function RoomEditModal({
  onClose,
  canvasRef,
  furnitures,
  width,
  height,
  userId,
  roomId,
}: RoomEditModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const captureAndSave = async () => {
      setIsSaving(true);
      try {
        await new Promise((res) => setTimeout(res, 700)); // 안정화를 위한 딜레이

        if (!canvasRef.current) throw new Error('캔버스를 찾을 수 없습니다.');

        const blob = await new Promise<Blob>((resolve, reject) => {
          canvasRef.current?.toBlob((b) => {
            if (b) resolve(b);
            else reject(new Error('썸네일 캡처 실패'));
          }, 'image/png');
        });

        await deleteRoomThumbnail(roomId);
        const thumbnailUrl = await uploadRoomThumbnail(blob, roomId);
        const existingRoom = await getRoomById(roomId);
        const cameraPosition = useCameraStore.getState().position;
        const background = useBackgroundStore.getState().currentBackgroundId;
        const isNightMode = !useLightingStore.getState().isDay;

        const dto: RoomSaveRequest = {
          id: roomId,
          name: existingRoom.name,
          width,
          height,
          thumbnailUrl,
          userId,
          furnitures,
          background,
          isNightMode,
          cameraX: cameraPosition[0],
          cameraY: cameraPosition[1],
          cameraZ: cameraPosition[2],
        };

        await updateRoom(roomId, dto);
        onClose();
        router.push('/list');
      } catch (error) {
      } finally {
        setIsSaving(false);
      }
    };

    captureAndSave();
  }, [canvasRef, furnitures, height, onClose, roomId, router, userId, width]);

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <div className='bg-[#444] rounded-2xl p-6 w-[320px] text-white text-center'>
        <p className='mb-4'>
          {isSaving ? '방을 수정 중입니다...' : '방을 수정합니다'}
        </p>
        <BoxTextButton disabled className='w-full'>
          {isSaving ? '수정 중...' : '수정 중 대기 중...'}
        </BoxTextButton>
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-white text-xl'
        >
          ×
        </button>
      </div>
    </div>
  );
}
