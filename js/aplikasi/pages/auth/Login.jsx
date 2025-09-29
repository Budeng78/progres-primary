// resources/js/aplikasi/pages/auth/Login.jsx
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '@/aplikasi/utils/axios';
import AuthContext from '@/aplikasi/auth/AuthContext';

const Login = () => {
    const [form, setForm] = useState({
        email: '',
        password: '',
        whatsapp_number: '',
        otp_code: '',
    });
    const [error, setError] = useState(null);
    const [step, setStep] = useState(1); // OTP step
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError(null);

        try {
            if (form.whatsapp_number) {
                // OTP login flow
                if (step === 1) {
                    await axios.post('/api/otp/send', {
                        name: form.email || 'User',
                        whatsapp_number: form.whatsapp_number,
                    });
                    setStep(2);
                } else if (step === 2) {
                    const response = await axios.post('/api/otp/verify', {
                        whatsapp_number: form.whatsapp_number,
                        otp_code: form.otp_code
                    });
                    const token = response.data?.access_token;
                    const user = response.data?.user;
                    if (token && user) {
                        login(token, user);
                        navigate('/');
                    }
                }
            } else {
                // Email/password login
                const response = await axios.post('/api/login', {
                    email: form.email,
                    password: form.password
                });
                const token = response.data?.access_token;
                const user = response.data?.user;
                if (token && user) {
                    login(token, user);
                    navigate('/');
                }
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || err.message || 'Login gagal');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <div className="mb-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={form.whatsapp_number && step === 2}
                    />
                </div>

                <div className="mb-4">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={form.whatsapp_number && step === 2}
                    />
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        name="whatsapp_number"
                        placeholder="Nomor WhatsApp"
                        value={form.whatsapp_number}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={form.email && form.password && step === 1}
                    />
                </div>

                {step === 2 && (
                    <div className="mb-4">
                        <input
                            type="text"
                            name="otp_code"
                            placeholder="Masukkan kode OTP"
                            value={form.otp_code}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                )}

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    {form.whatsapp_number ? (step === 1 ? 'Kirim OTP' : 'Verifikasi OTP') : 'Masuk'}
                </button>

                <p className="mt-4 text-sm text-center">
                    Belum punya akun?{' '}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Daftar
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
