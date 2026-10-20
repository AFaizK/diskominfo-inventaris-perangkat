import API from './axios';

const BASE = '/inventaris-perangkat';

export const KATEGORI = ['Laptop', 'Printer', 'Jaringan'];
export const STATUS = ['Tersedia', 'Digunakan', 'Perbaikan'];

export const STATUS_BADGE = {
  Tersedia: 'success',
  Digunakan: 'info',
  Perbaikan: 'warning',
};

export const listInventaris = () => API.get(BASE).then((res) => res.data.data);
export const getInventaris = (id) => API.get(`${BASE}/${id}`).then((res) => res.data.data);
export const createInventaris = (payload) => API.post(BASE, payload).then((res) => res.data);
export const updateInventaris = (id, payload) => API.put(`${BASE}/${id}`, payload).then((res) => res.data);
export const deleteInventaris = (id) => API.delete(`${BASE}/${id}`).then((res) => res.data);

export const formatRupiah = (nilai) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(nilai);

export const formatTanggal = (tanggal) =>
  new Date(`${tanggal}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

// Ambil pesan error yang ramah dari respons axios
export const errorMessage = (err, fallback = 'Terjadi kesalahan. Silakan coba lagi.') => {
  if (!err.response) return 'Gagal terhubung ke server backend.';
  if (err.response.status === 404) return 'Data tidak ditemukan.';
  return err.response.data?.message || fallback;
};
