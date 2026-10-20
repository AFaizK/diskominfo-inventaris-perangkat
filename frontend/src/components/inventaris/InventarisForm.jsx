import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Breadcrumb, Button, SelectDropdown, TextArea, TextField, useToast } from '@idds/react';
import {
  KATEGORI, STATUS, createInventaris, errorMessage, getInventaris, updateInventaris,
} from '../../api/inventaris';
import { ErrorState, LoadingState } from './StateViews';

const EMPTY = {
  kode: '', nama: '', kategori: '', unit: '', tanggal: '', nilai: '', status: '', catatan: '',
};

const toOptions = (list) => list.map((v) => ({ label: v, value: v }));

// Label + pesan error untuk dropdown (SelectDropdown tidak punya prop label)
function SelectField({ id, label, error, children }) {
  return (
    <div className="space-y-1">
      <label id={`${id}-label`} className="block text-sm font-medium text-gray-700">
        {label} <span className="text-red-600" aria-hidden="true">*</span>
      </label>
      <div aria-labelledby={`${id}-label`}>{children}</div>
      {error && <p id={`${id}-error`} role="alert" className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default function InventarisForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    getInventaris(id)
      .then((item) => setForm({ ...EMPTY, ...item, nilai: String(item.nilai), catatan: item.catatan ?? '' }))
      .catch((err) => setLoadError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const setField = (name) => (value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const fieldProps = (name) => ({
    value: form[name],
    onChange: setField(name),
    status: errors[name] ? 'error' : 'neutral',
    statusMessage: errors[name],
    disabled: saving,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setFormError('');

    const payload = { ...form, nilai: form.nilai === '' ? '' : Number(form.nilai), catatan: form.catatan || null };

    try {
      const res = isEdit ? await updateInventaris(id, payload) : await createInventaris(payload);
      toast({ state: 'positive', title: 'Berhasil', description: res.message });
      navigate(`/inventaris/${res.data.id}`);
    } catch (err) {
      if (err.response?.status === 422) {
        const fieldErrors = Object.fromEntries(
          Object.entries(err.response.data.errors || {}).map(([k, v]) => [k, v[0]])
        );
        setErrors(fieldErrors);
        setFormError('Periksa kembali isian yang ditandai.');
      } else {
        setFormError(errorMessage(err, 'Gagal menyimpan data.'));
      }
      toast({ state: 'destructive', title: 'Gagal menyimpan', description: 'Data belum tersimpan.' });
      setSaving(false);
    }
  };

  const title = isEdit ? 'Ubah data inventaris' : 'Tambah data inventaris';

  return (
    <div className="space-y-4">
      <Breadcrumb items={[
        { label: 'Inventaris', onClick: () => navigate('/inventaris') },
        { label: isEdit ? 'Ubah' : 'Tambah' },
      ]} />

      {loading && <LoadingState />}
      {!loading && loadError && <ErrorState message={loadError} />}

      {!loading && !loadError && (
        <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
          <div>
            <h1 className="!m-0 !text-2xl font-bold !tracking-normal text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500">Kolom bertanda * wajib diisi.</p>
          </div>

          {formError && <Alert variant="critical" title="Gagal menyimpan" message={formError} />}

          <div className="grid gap-4 md:grid-cols-2">
            <TextField label="Kode *" placeholder="contoh: IT1-021" maxLength={50} {...fieldProps('kode')} />
            <TextField label="Nama perangkat *" placeholder="contoh: Laptop administrasi" {...fieldProps('nama')} />

            <SelectField id="kategori" label="Kategori" error={errors.kategori}>
              <SelectDropdown
                options={toOptions(KATEGORI)}
                selected={form.kategori}
                onSelect={setField('kategori')}
                placeholder="Pilih kategori"
                searchable={false}
              />
            </SelectField>

            <TextField label="Unit *" placeholder="contoh: Sekretariat" {...fieldProps('unit')} />
            <TextField label="Tanggal perolehan *" type="date" showClearButton={false} {...fieldProps('tanggal')} />
            <TextField
              label="Harga perolehan (rupiah) *"
              type="number"
              min={0}
              step={1}
              inputMode="numeric"
              placeholder="0"
              helperText="Nol atau lebih."
              showClearButton={false}
              {...fieldProps('nilai')}
            />

            <SelectField id="status" label="Status" error={errors.status}>
              <SelectDropdown
                options={toOptions(STATUS)}
                selected={form.status}
                onSelect={setField('status')}
                placeholder="Pilih status"
                searchable={false}
              />
            </SelectField>

            <div className="md:col-span-2">
              <TextArea label="Catatan" placeholder="Opsional" minRows={3} {...fieldProps('catatan')} />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" hierarchy="secondary" disabled={saving}
              onClick={() => navigate(isEdit ? `/inventaris/${id}` : '/inventaris')}>
              Batal
            </Button>
            <Button type="submit" hierarchy="primary" disabled={saving}>
              {saving ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
