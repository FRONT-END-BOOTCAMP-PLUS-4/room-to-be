import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
export async function deleteRoomThumbnail(roomId: string): Promise<void> {
  const path = `room-thumbnails/${roomId}.png`;
  const { error } = await supabase.storage.from('r2b').remove([path]);
  if (error) throw error;
}
