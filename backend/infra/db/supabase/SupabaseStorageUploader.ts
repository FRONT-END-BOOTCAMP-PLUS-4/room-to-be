import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function uploadRoomThumbnail(
  blob: Blob,
  roomId: string,
): Promise<string> {
  const filePath = `room-thumbnails/${roomId}.png`;
  
  const { error } = await supabase.storage
    .from('r2b') // 실제 버킷 이름
    .upload(filePath, blob, {
      upsert: true,
      contentType: 'image/png',
    });

  if (error) throw error;

  const { data } = supabase.storage.from('r2b').getPublicUrl(filePath);
  return data.publicUrl;
}
