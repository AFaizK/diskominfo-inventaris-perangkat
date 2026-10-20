import React from 'react';
import { Alert, Button, Spinner } from '@idds/react';

export function LoadingState({ text = 'Memuat data...' }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center gap-3 py-12 text-sm text-gray-500">
      <Spinner size={32} />
      <span>{text}</span>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div role="alert" className="space-y-3">
      <Alert variant="critical" title="Gagal memuat data" message={message} />
      {onRetry && (
        <Button hierarchy="secondary" size="sm" onClick={onRetry}>
          Coba lagi
        </Button>
      )}
    </div>
  );
}

export function EmptyState({ action }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-white py-12 text-center">
      <p className="font-semibold text-gray-700">Belum ada data inventaris</p>
      <p className="text-sm text-gray-500">Tambahkan perangkat pertama untuk mulai mencatat.</p>
      {action}
    </div>
  );
}
