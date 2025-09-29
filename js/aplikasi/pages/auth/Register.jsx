// File: Register.jsx

import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Tambahkan 'Link'

function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    whatsapp_number: '',
    password: '',
    password_confirmation: '',
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('/api/register', form);
      const token = response.data?.access_token;

      if (token) {
        localStorage.setItem('token', token);
        navigate(response.data.redirect || '/');
      } else {
        throw new Error('Token tidak ditemukan');
      }
    } catch (err) {
      console.error('Register error:', err);
      setError(err.response?.data?.message || err.message || 'Register gagal');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Daftar</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nama</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Nama Anda"
            required
            autoComplete="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Anda"
            required
            autoComplete="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="whatsapp_number" className="block text-gray-700 text-sm font-bold mb-2">
            No WhatsApp
          </label>
          <input
            id="whatsapp_number"
            name="whatsapp_number"
            type="text"
            value={form.whatsapp_number || ""}
            onChange={handleChange}
            placeholder="Contoh: 081234567890"
            required
            autoComplete="tel"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            autoComplete="new-password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password_confirmation" className="block text-gray-700 text-sm font-bold mb-2">Konfirmasi Password</label>
          <input
            id="password_confirmation"
            name="password_confirmation"
            type="password"
            value={form.password_confirmation}
            onChange={handleChange}
            placeholder="Konfirmasi Password"
            required
            autoComplete="new-password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Daftar
          </button>
          {/* Tambahkan tombol 'tutup' yang mengarahkan ke halaman beranda */}
          <Link
            to="/"
            className="text-center text-sm text-gray-500 hover:text-gray-700 hover:underline"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
