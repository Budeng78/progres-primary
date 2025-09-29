// resources/js/aplikasi/auth/AuthProvider.jsx

import React, { useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem('token');
    });

    // Mengelola state pengguna
    const [user, setUser] = useState(() => {
        // Tambahkan try...catch untuk mengelola kesalahan penguraian JSON
        try {
            const userData = localStorage.getItem('user');
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error("Gagal mengurai data pengguna dari localStorage:", error);
            // Hapus data yang rusak untuk mencegah kesalahan di masa mendatang
            localStorage.removeItem('user');
            return null;
        }
    });
    
    const [authTimeoutId, setAuthTimeoutId] = useState(null);
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);
    const navigate = useNavigate();

    const SESSION_TIMEOUT = 30 * 60 * 1000;

    const startAuthTimer = () => {
        if (authTimeoutId) {
            clearTimeout(authTimeoutId);
        }
        const id = setTimeout(() => {
            console.log('Sesi berakhir. Logout otomatis.');
            logout();
        }, SESSION_TIMEOUT);
        setAuthTimeoutId(id);
    };

    const resetAuthTimer = () => {
        if (isAuthenticated) {
            startAuthTimer();
        }
    };
    
    // Memperbarui fungsi login untuk menyimpan token dan data pengguna
    const login = (token, userData) => {
        try {
            // console.log yang sebelumnya telah dihapus untuk membersihkan konsol
            
            if (!userData) {
                console.warn("UserData is undefined. The login component might not be sending the user object.");
                // Jika userData tidak terdefinisi, jangan mencoba menyimpannya
                // Namun, kita tetap lanjut untuk otentikasi
            } else {
                localStorage.setItem('user', JSON.stringify(userData));
            }
            
            localStorage.setItem('token', token);
            setIsAuthenticated(true);
            setUser(userData);
            setShowWelcomeModal(true);
            startAuthTimer();
        } catch (error) {
            console.error("Gagal menyimpan token di localStorage:", error);
        }
    };

    const logout = () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user'); // Hapus data pengguna dari localStorage
            setIsAuthenticated(false);
            setUser(null);
            if (authTimeoutId) {
                clearTimeout(authTimeoutId);
            }
        } catch (error) {
            console.error("Gagal menghapus token dari localStorage:", error);
        }
        navigate('/auth/login');
    };

    useEffect(() => {
        const handleInteraction = () => {
            resetAuthTimer();
        };

        window.addEventListener('mousemove', handleInteraction);
        window.addEventListener('keydown', handleInteraction);
        window.addEventListener('click', handleInteraction);

        return () => {
            window.removeEventListener('mousemove', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
            window.removeEventListener('click', handleInteraction);
        };
    }, [isAuthenticated]);

    useEffect(() => {
        return () => {
            if (authTimeoutId) {
                clearTimeout(authTimeoutId);
            }
        };
    }, [authTimeoutId]);

    const value = {
        isAuthenticated,
        user,
        login,
        logout,
        resetAuthTimer,
        showWelcomeModal,
        setShowWelcomeModal,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;