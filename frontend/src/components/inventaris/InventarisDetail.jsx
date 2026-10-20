import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge, Breadcrumb, Button, useToast } from '@idds/react';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import {
  STATUS_BADGE, deleteInventaris, errorMessage, formatRupiah, formatTanggal, getInventaris,
} from '../../api/inventaris';
import { ErrorState, LoadingState } from './StateViews';
import DeleteConfirm from './DeleteConfirm';

export default function InventarisDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setItem(await getInventaris(id));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await deleteInventaris(item.id);
      toast({ state: 'positive', title: 'Berhasil', description: res.message });
      navigate('/inventaris');
    } catch (err) {
      toast({ state: 'destructive', title: 'Gagal menghapus', description: errorMessage(err) });
      setDeleting(false);
    }
  };

  const rows = item && [
    ['Kode', <span className="font-mono">{item.kode}</span>],
    ['Nama', item.nama],
    ['Kategori', item.kategori],
    ['Unit', item.unit],
    ['Tanggal', formatTanggal(item.tanggal)],
    ['Harga perolehan', formatRupiah(item.nilai)],
    ['Status', <Badge variant={STATUS_BADGE[item.status]}>{item.status}</Badge>],
    ['Catatan', item.catatan || <span className="text-gray-400">-</span>],
  ];

  return (
    <div className="space-y-4">
      <Breadcrumb items={[
        { label: 'Inventaris', onClick: () => navigate('/inventaris') },
        { label: item ? item.kode : 'Detail' },
      ]} />

      {loading && <LoadingState />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}

      {!loading && item && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="!m-0 !text-2xl font-bold !tracking-normal text-gray-900">{item.nama}</h1>
            <div className="flex flex-wrap gap-2">
              <Button hierarchy="secondary" prefixIcon={<IconPencil size={16} />} onClick={() => navigate(`/inventaris/${item.id}/ubah`)}>
                Ubah
              </Button>
              <Button hierarchy="secondary" className="!text-red-600" prefixIcon={<IconTrash size={16} />} onClick={() => setConfirmOpen(true)}>
                Hapus
              </Button>
            </div>
          </div>
          <dl className="divide-y divide-gray-100">
            {rows.map(([label, value]) => (
              <div key={label} className="grid gap-1 py-3 sm:grid-cols-3">
                <dt className="text-sm text-gray-500">{label}</dt>
                <dd className="text-sm text-gray-900 sm:col-span-2">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <DeleteConfirm
        item={confirmOpen ? item : null}
        deleting={deleting}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
