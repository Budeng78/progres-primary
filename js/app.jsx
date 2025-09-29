// resources/js/aplikasi/App.jsx

import React, { lazy, Suspense, useContext, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
    BrowserRouter,
    Routes,
    Route,
    useNavigate,
    Navigate,
} from 'react-router-dom';


// Impor AuthProvider dan AuthContext
// Menggunakan alias @/aplikasi/ sesuai permintaan Anda
import AuthProvider from '@/aplikasi/auth/AuthProvider';
import AuthContext from '@/aplikasi/auth/AuthContext';

// Impor modal baru
import LoginRequiredModal from '@/aplikasi/components/modal/LoginRequiredModal';

// PENTING: Pastikan impor DefaultLayout ada dan benar
import DefaultLayout from '@/aplikasi/layouts/DefaultLayout';

// Lazy load halaman
const LandingPage = lazy(() => import('@/aplikasi/LandingPage'));
const NotFoundHandler = lazy(() => import('@/aplikasi/components/modal/NotFoundModal'));
const Login = lazy(() => import('@/aplikasi/pages/auth/Login'));
const Register = lazy(() => import('@/aplikasi/pages/auth/Register'));
const OtpLogin = lazy(() => import('@/aplikasi/pages/auth/OtpLogin'));
const VisiMisiPage = lazy(() => import('@/aplikasi/pages/section1/VisiMisiPage'));

// kelompok system
const Role = lazy(() => import('@/aplikasi/pages/system/user/Role'));
const Permission = lazy(() => import('@/aplikasi/pages/system/user/Permission'));
const UserAkses = lazy(() => import('@/aplikasi/pages/system/user/UserAkses'));

const UserInfo = lazy(() => import('@/aplikasi/pages/UserInfo'));

// Tambahkan lazy load untuk halaman karyawan
const KaryawanDash = lazy(() => import('@/aplikasi/pages/Karyawan/KaryawanDash'));
const KaryawanList = lazy(() => import('@/aplikasi/pages/Karyawan/KaryawanList'));
const KaryawanDetail = lazy(() => import('@/aplikasi/pages/Karyawan/KaryawanDetail'));
const KaryawanEdit = lazy(() => import('@/aplikasi/pages/Karyawan/KaryawanEdit'));
const KaryawanCreate = lazy(() => import('@/aplikasi/pages/Karyawan/KaryawanCreate'));
const KaryawanUploadFoto = lazy(() => import("@/aplikasi/pages/KaryawanUploadFoto"));


// Komponen rute yang dilindungi, sekarang menampilkan modal
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Tampilkan modal jika tidak diautentikasi
        if (!isAuthenticated) {
            setShowModal(true);
        } else {
            setShowModal(false);
        }
    }, [isAuthenticated]);

    const handleCloseModal = () => {
        setShowModal(false);
        // Setelah modal ditutup, alihkan ke halaman login
        navigate('/auth/login'); 
    };

    if (isAuthenticated) {
        return children;
    }

    return (
        <>
            <LoginRequiredModal
                isOpen={showModal}
                onClose={handleCloseModal}
            />
            {/* Render null atau loading state saat modal ditampilkan */}
            <div className="flex justify-center items-center h-screen w-full">
                Memuat...
            </div>
        </>
    );
};

const App = () => (
    <BrowserRouter>
        <AuthProvider>
            <DefaultLayout>
                <Suspense fallback={<div>Memuat halaman...</div>}>
                    <Routes>
                        {/* Rute publik */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/auth/login" element={<Login />} />
                        <Route path="/auth/register" element={<Register />} />
                        <Route path="/auth/otp-login" element={<OtpLogin />} />
                        

                        {/* Rute yang dilindungi */}
                        <Route path="/section1/visi-misi" element={<ProtectedRoute><VisiMisiPage /></ProtectedRoute>} />
                        <Route path="/UserInfo" element={<ProtectedRoute><UserInfo /></ProtectedRoute>} />
                        
                        {/* grup System */}
                        <Route path="/system/user/role" element={<ProtectedRoute><Role /></ProtectedRoute>} />
                        <Route path="/system/user/permission" element={<ProtectedRoute><Permission /></ProtectedRoute>} />
                        <Route path="/system/user/userakses" element={<ProtectedRoute><UserAkses /></ProtectedRoute>} />

                        {/* grup karyawan */}
                        <Route path="/karyawan/dash" element={<ProtectedRoute><KaryawanDash /></ProtectedRoute>} />
                        <Route path="/karyawan/list" element={<ProtectedRoute><KaryawanList /></ProtectedRoute>} />
                        <Route path="/karyawan/detail/:id"  element= {<ProtectedRoute><KaryawanDetail /></ProtectedRoute>}/>
                        <Route path="/karyawan/edit/:employeeId" element={<ProtectedRoute><KaryawanEdit /></ProtectedRoute>} />
                        <Route path="/karyawan/create" element={<ProtectedRoute><KaryawanCreate /></ProtectedRoute>} />
                        <Route path="/karyawan/upload-foto" element={<ProtectedRoute><KaryawanUploadFoto /></ProtectedRoute>} />
                        
                        {/* Rute untuk halaman tidak ditemukan */}
                        <Route path="*" element={<NotFoundHandler />} />
                    </Routes>
                </Suspense>
            </DefaultLayout>
        </AuthProvider>
    </BrowserRouter>
);

// Pastikan elemen #app ada di HTML Anda
const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    console.error('Element with ID "app" not found in the DOM.');
}
