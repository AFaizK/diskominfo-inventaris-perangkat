import React, { useState } from 'react';
import API from '../api/axios';
import { Alert, Button, PasswordInput, TextField } from '@idds/react';
import { IconLock, IconMail } from '@tabler/icons-react';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setErrors({});
    setLoading(true);

    try {
      // Send request ke endpoint Sanctum login Laravel
      const response = await API.post('/login', { email, password });
      
      // Simpan Bearer Token ke localStorage
      const token = response.data.access_token;
      localStorage.setItem('token', token);
      
      // Simpan data user jika dibutuhkan
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      // Trigger callback untuk ubah state di App.jsx
      onLoginSuccess();
    } catch (err) {
      if (err.response?.status === 422) {
        // Validasi backend: tampilkan pesan di bawah masing-masing isian
        setErrors(Object.fromEntries(
          Object.entries(err.response.data.errors || {}).map(([k, v]) => [k, v[0]])
        ));
        setError('Periksa kembali isian yang ditandai.');
      } else if (err.response && err.response.data) {
        setError(err.response.data.message || 'Email atau password salah!');
      } else {
        setError('Gagal terhubung ke server backend.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 space-y-6 border border-gray-100">
        
        {/* Header Form */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Masuk ke Sistem</h2>
          <p className="text-sm text-gray-500">Aplikasi Pengelolaan Data Diskominfo</p>
        </div>

        {/* Alert Error */}
        {error && <Alert variant="critical" title="Gagal masuk" message={error} />}

        {/* Form Login: validasi dilakukan di backend */}
        <form onSubmit={handleLogin} noValidate className="space-y-4">
          <div>
            <TextField
              label="Alamat Email *"
              type="email"
              placeholder="contoh: admin@diskominfo.go.id"
              value={email}
              onChange={(val) => { setEmail(val); setErrors((p) => ({ ...p, email: undefined })); }}
              status={errors.email ? 'error' : 'neutral'}
              statusMessage={errors.email}
              disabled={loading}
            />
          </div>

          <div>
            <PasswordInput
              label="Kata Sandi *"
              placeholder="••••••••"
              value={password}
              onChange={(val) => { setPassword(val); setErrors((p) => ({ ...p, password: undefined })); }}
              status={errors.password ? 'error' : 'neutral'}
              statusMessage={errors.password}
              disabled={loading}
            />
          </div>


          <Button
            hierarchy="primary"
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </Button>
        </form>

        {/* Info Kredensial Uji */}
        <div className="p-3 bg-blue-50 text-blue-800 text-xs rounded-lg space-y-1">
          <p className="font-semibold">Akun Uji Kredensial:</p>
          <p>Email: <code className="bg-blue-100 px-1 rounded">admin@gmail.com</code></p>
          <p>Password: <code className="bg-blue-100 px-1 rounded">rahasia123</code></p>
          <p className="text-red-600">
            <span className="font-bold">Peringatan:</span> Jalankan seeder terlebih dahulu
          </p>
        </div>

      </div>
    </div>
  );
}