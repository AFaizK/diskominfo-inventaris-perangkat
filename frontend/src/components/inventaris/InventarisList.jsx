import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge, Button, useToast } from '@idds/react';
import { IconEye, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import {
  STATUS_BADGE, deleteInventaris, errorMessage, formatRupiah, formatTanggal, listInventaris,
} from '../../api/inventaris';
import { EmptyState, ErrorState, LoadingState } from './StateViews';
import DeleteConfirm from './DeleteConfirm';

export default function InventarisList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setItems(await listInventaris());
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await deleteInventaris(toDelete.id);
      setItems((prev) => prev.filter((i) => i.id !== toDelete.id));
      toast({ state: 'positive', title: 'Berhasil', description: res.message });
      setToDelete(null);
    } catch (err) {
      toast({ state: 'destructive', title: 'Gagal menghapus', description: errorMessage(err) });
    } finally {
      setDeleting(false);
    }
  };

  const addButton = (
    <Button hierarchy="primary" prefixIcon={<IconPlus size={16} />} onClick={() => navigate('/inventaris/baru')}>
      Tambah data
    </Button>
  );

  const actions = (item) => (
    <div className="flex flex-wrap gap-2">
      <Button hierarchy="tertiary" size="sm" prefixIcon={<IconEye size={16} />}
        onClick={() => navigate(`/inventaris/${item.id}`)} aria-label={`Lihat detail ${item.kode}`}>
        Detail
      </Button>
      <Button hierarchy="secondary" size="sm" prefixIcon={<IconPencil size={16} />}
        onClick={() => navigate(`/inventaris/${item.id}/ubah`)} aria-label={`Ubah ${item.kode}`}>
        Ubah
      </Button>
      <Button hierarchy="secondary" size="sm" className="!text-red-600" prefixIcon={<IconTrash size={16} />}
        onClick={() => setToDelete(item)} aria-label={`Hapus ${item.kode}`}>
        Hapus
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="!m-0 !text-2xl font-bold !tracking-normal text-gray-900">Inventaris perangkat TI</h1>
          {!loading && !error && <p className="text-sm text-gray-500">{items.length} data</p>}
        </div>
        {addButton}
      </div>

      {loading && <LoadingState />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && items.length === 0 && <EmptyState action={addButton} />}

      {!loading && !error && items.length > 0 && (
        <>
          {/* Tampilan komputer: tabel */}
          <div className="hidden overflow-x-auto rounded-xl border border-gray-200 bg-white md:block">
            <table className="w-full text-sm">
              <caption className="sr-only">Daftar inventaris perangkat TI</caption>
              <thead className="bg-gray-50 text-left text-gray-600">
                <tr>
                  {['Kode', 'Nama', 'Kategori', 'Unit', 'Tanggal', 'Harga perolehan', 'Status', 'Aksi'].map((h) => (
                    <th key={h} scope="col" className="px-4 py-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-gray-800">{item.kode}</td>
                    <td className="px-4 py-3">
                      <Link to={`/inventaris/${item.id}`} className="text-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                        {item.nama}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{item.kategori}</td>
                    <td className="px-4 py-3">{item.unit}</td>
                    <td className="whitespace-nowrap px-4 py-3">{formatTanggal(item.tanggal)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">{formatRupiah(item.nilai)}</td>
                    <td className="px-4 py-3"><Badge variant={STATUS_BADGE[item.status]}>{item.status}</Badge></td>
                    <td className="px-4 py-3">{actions(item)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tampilan ponsel: kartu */}
          <ul className="space-y-3 md:hidden">
            {items.map((item) => (
              <li key={item.id} className="space-y-2 rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-xs text-gray-500">{item.kode}</p>
                    <p className="font-semibold text-gray-900">{item.nama}</p>
                  </div>
                  <Badge variant={STATUS_BADGE[item.status]}>{item.status}</Badge>
                </div>
                <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                  <dt className="text-gray-500">Kategori</dt><dd>{item.kategori}</dd>
                  <dt className="text-gray-500">Unit</dt><dd>{item.unit}</dd>
                  <dt className="text-gray-500">Tanggal</dt><dd>{formatTanggal(item.tanggal)}</dd>
                  <dt className="text-gray-500">Harga</dt><dd>{formatRupiah(item.nilai)}</dd>
                </dl>
                {actions(item)}
              </li>
            ))}
          </ul>
        </>
      )}

      <DeleteConfirm item={toDelete} deleting={deleting} onCancel={() => setToDelete(null)} onConfirm={handleDelete} />
    </div>
  );
}
