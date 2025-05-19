import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

//방 썸네일 업로더
export async function uploadRoomThumbnail(blob: Blob, roomId: string): Promise<string> {
  const path = `room-thumbnails/${roomId}.png`;
  const { error } = await supabase.storage.from('r2b').upload(path, blob, {
    upsert: true,
    contentType: 'image/png',
  });
  if (error) throw error;
  return supabase.storage.from('r2b').getPublicUrl(path).data.publicUrl;
}

//가구 썸네일 업로더
export async function uploadFurnitureThumbnail(blob: Blob, furnitureId: string): Promise<string> {
  const path = `furniture-thumbnails/${furnitureId}.png`;
  const { error } = await supabase.storage.from('r2b').upload(path, blob, {
    upsert: true,
    contentType: 'image/png',
  });
  if (error) throw error;
  return supabase.storage.from('r2b').getPublicUrl(path).data.publicUrl;
}

//가구 모델 업로더
export async function uploadFurnitureModel(blob: Blob, furnitureId: string): Promise<string> {
  const path = `models/${furnitureId}.glb`;
  const { error } = await supabase.storage.from('r2b').upload(path, blob, {
    upsert: true,
    contentType: 'model/gltf-binary',
  });
  if (error) throw error;
  return supabase.storage.from('r2b').getPublicUrl(path).data.publicUrl;
}
