// resources/js/aplikasi/layouts/DefaultLayout.jsx
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '@/aplikasi/auth/AuthContext';
import TopNavBar from '@/aplikasi/layouts/navbar/TopNavBar';
import BottomNavbar from '@/aplikasi/layouts/navbar/BottomNavbar';
import SideNavbar from '@/aplikasi/layouts/navbar/SideNavbar';
import LoginOptionsModal from '@/aplikasi/components/modal/LoginOptionsModal';
import ShowWelcomeModal from '@/aplikasi/components/modal/showWelcomeModal';
import { 
    authDesktopMenuItems, 
    authMobileMenuItems, 
    guestDesktopMenuItems, 
    guestMobileMenuItems 
} from '@/aplikasi/layouts/menuConfig';
import { filterMenuByPermission } from '@/aplikasi/layouts/menuFilter';

const DefaultLayout = ({ children }) => {
    const { isAuthenticated, logout, user, showWelcomeModal, setShowWelcomeModal } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Fungsi navigasi login/register/OTP
    const handleLogin = () => {
        setShowLoginModal(false);
        navigate('/auth/login');
    };

    const handleRegister = () => {
        setShowLoginModal(false);
        navigate('/auth/register');
    };

    const handleOtp = () => {
        setShowLoginModal(false);
        navigate('/auth/otp-login');
    };

    // Ambil permission user, fallback ke array kosong
    const userPermissions = Array.isArray(user?.permissions) ? user.permissions : [];

    // Filter menu berdasarkan permission
    const desktopMenuItems = isAuthenticated
        ? filterMenuByPermission(authDesktopMenuItems(logout), userPermissions)
        : guestDesktopMenuItems(handleLogin, handleRegister, () => setShowLoginModal(true), handleOtp);

    const mobileMenuItems = isAuthenticated
        ? filterMenuByPermission(authMobileMenuItems(logout), userPermissions)
        : guestMobileMenuItems(handleLogin, handleRegister, () => setShowLoginModal(true), handleOtp);

    return (
        <div className="flex flex-col min-h-screen">
            <TopNavBar />

            <div className="flex flex-1">
                {/* Sidebar */}
                <SideNavbar menuItems={desktopMenuItems} />

                {/* Main content */}
                <main className="flex-1 p-4 md:ml-56 mt-16">
                    {children}
                </main>
            </div>

            {/* Navbar mobile */}
            <BottomNavbar menuItems={mobileMenuItems} />

            {/* Modal login */}
            <LoginOptionsModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onLogin={handleLogin}
                onRegister={handleRegister}
                onOtp={handleOtp}
            />

            {/* Modal welcome */}
            <ShowWelcomeModal
                isOpen={showWelcomeModal}
                onClose={() => setShowWelcomeModal(false)}
            />
        </div>
    );
};

export default DefaultLayout;
