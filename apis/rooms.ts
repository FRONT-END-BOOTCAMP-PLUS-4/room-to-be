interface RoomResponse {
  id: string;
  name: string;
  width: number;
  height: number;
  thumbnailUrl: string;
  userId: string;
  createdAt: string;
}

export async function saveRoom(formData: FormData): Promise<RoomResponse> {
  const res = await fetch('/api/rooms', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`방 저장 실패: ${res.status}`);
  }

  return await res.json();
}

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
