import React from 'react';
import { Button, Modal } from '@idds/react';

export default function DeleteConfirm({ item, deleting, onCancel, onConfirm }) {
  return (
    <Modal open={!!item} onClose={deleting ? () => {} : onCancel} title="Hapus data?" size="sm">
      {item && (
        <div className="space-y-4 text-left">
          <p className="text-sm text-gray-700">
            Data <strong>{item.kode}</strong> — {item.nama} akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button hierarchy="secondary" onClick={onCancel} disabled={deleting}>
              Batal
            </Button>
            <Button hierarchy="primary" className="!bg-red-600" onClick={onConfirm} disabled={deleting}>
              {deleting ? 'Menghapus...' : 'Ya, hapus'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
