'use client';
import { RoomResponse } from '@/app/types/rooms';
import { RoomSaveRequest } from '@/app/types/rooms';
//방 저장
export async function saveRoom(dto: RoomSaveRequest): Promise<RoomResponse> {
  const res = await fetch('/api/rooms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    throw new Error(`방 저장 실패: ${res.status}`);
  }

  return await res.json();
}

// 방 업데이트
export async function updateRoom(
  roomId: string,
  dto: RoomSaveRequest,
): Promise<RoomResponse> {
  const res = await fetch(`/api/rooms/${roomId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    throw new Error(`방 수정 실패: ${res.status}`);
  }

  return await res.json();
}
//방 삭제
export async function deleteRoomById(roomId: string): Promise<void> {
  const res = await fetch(`/api/rooms/${roomId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('존재하지 않는 방입니다.');
    } else {
      throw new Error(`방 삭제 실패: ${res.status}`);
    }
  }
}
// 유저 아이디로 방 목록 가져오기
export async function getRoomsByUserId(
  userId: string,
): Promise<RoomResponse[]> {
  const res = await fetch(`/api/rooms?userId=${userId}`);

  if (!res.ok) {
    throw new Error(`방 목록 불러오기 실패: ${res.status}`);
  }
  const data = await res.json();
  return data.rooms;
}

export async function getRoomById(roomId: string): Promise<RoomResponse> {
  const res = await fetch(`/api/rooms/${roomId}`);

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('존재하지 않는 방입니다.');
    }
    throw new Error(`방 조회 실패: ${res.status}`);
  }

  return await res.json();
}
