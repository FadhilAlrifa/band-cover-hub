import { supabase } from './supabase';

// 1. Ambil semua lagu dari pangkalan data Supabase
export const fetchSongs = async () => {
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Gagal mengambil lagu dari Supabase:', error);
    return [];
  }
  return data;
};

// 2. Tambah lagu baru ke pangkalan data
export const addSongToDatabase = async (songData, uploadedBy) => {
  const { data, error } = await supabase
    .from('songs')
    .insert([
      {
        title: songData.title,
        artist: songData.artist,
        key: songData.key,
        status: songData.status,
        bpm: songData.bpm,
        lyrics: songData.lyrics,
        uploaded_by: uploadedBy
      }
    ]);

  if (error) {
    console.error('Gagal menambah lagu:', error);
    throw error;
  }
  return data;
};

// 3. Langgan perubahan Real-time (kemaskini automatik apabila pengguna lain menambah lagu)
export const subscribeToSongs = (onDataUpdate) => {
  const channel = supabase
    .channel('public:songs')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'songs' },
      async () => {
        const updatedSongs = await fetchSongs();
        onDataUpdate(updatedSongs);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
// Function untuk mengubah status lagu (misal: dari wishlist ke completed)
export const updateSongStatus = async (songId, newStatus) => {
  const { data, error } = await supabase
    .from('songs')
    .update({ status: newStatus })
    .eq('id', songId);

  if (error) {
    console.error('Gagal memperbarui status lagu:', error);
    throw error;
  }
  return data;
};