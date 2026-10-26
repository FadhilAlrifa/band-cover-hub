import { supabase } from './supabase';

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

export const getSongs = fetchSongs;

export const addSongToDatabase = async (songData, uploadedBy) => {
  const { data, error } = await supabase
    .from('songs')
    .insert([
      {
        title: songData.title,
        artist: songData.artist,
        key: songData.key,
        status: songData.status || 'wishlist',
        bpm: songData.bpm,
        lyrics: songData.lyrics,
        uploaded_by: uploadedBy || null
      }
    ])
    .select();

  if (error) {
    console.error('Gagal menambah lagu:', error);
    throw error;
  }
  return data ? data[0] : null;
};

export const addSong = (songData) => addSongToDatabase(songData, null);

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

export const updateSongStatus = async (songId, newStatus) => {
  const { data, error } = await supabase
    .from('songs')
    .update({ status: newStatus })
    .eq('id', songId)
    .select();

  if (error) {
    console.error('Gagal memperbarui status lagu:', error);
    throw error;
  }
  return data;
};

export const deleteSong = async (songId) => {
  const { data, error } = await supabase
    .from('songs')
    .delete()
    .eq('id', songId);

  if (error) {
    throw error;
  }
  return data;
};