// resources/js/aplikasi/layouts/menuConfig.js
import { 
    FaHome, 
    FaSignInAlt, 
    FaUserPlus, 
    FaSignOutAlt, 
    FaChartBar, 
    FaUser,
    FaUsers,
    FaList,
    FaUserShield,
    FaKey
} from 'react-icons/fa';

/**
 * Menu untuk pengguna yang sudah login (Desktop)
 * @param {Function} handleLogout 
 */
export const authDesktopMenuItems = (handleLogout) => [
    { 
        label: 'Beranda', 
        path: '/',
        icon: FaHome, 
    },
    {
        label: 'System',
        icon: FaUsers,
        permission: 'admin-system.manage', // parent hanya muncul jika punya permission
        children: [
            {
                label: 'Akses',
                icon: FaList,
                children: [
                    { label: 'Role', path: '/system/user/role', permission:'admin-system.manage', icon: FaUserShield },
                    { label: 'Permission', path: '/system/user/permission', permission:'admin-system.manage', icon: FaKey },
                    { label: 'UserAkses', path: '/system/user/userakses', permission:'admin-system.manage', icon: FaUsers },
                ],
            },
            {
                label: 'Laporan',
                path: '/karyawan/upload-foto',
                permission: 'user.hrd',
                icon: FaChartBar,
            },
        ],
    },
    {
        label: 'Karyawan', 
        icon: FaUsers,
        //permission: 'user.hrd',
        children: [
            {
                label: 'List',
                path: '/karyawan/list',
                icon: FaList,
            },
            {
                label: 'Laporan', 
                path: '/karyawan/upload-foto', 
                icon: FaChartBar, 
            },
        ],
    },
    {
        label: 'User', 
        icon: FaUser,
        children: [ 
            {
                label: 'Profil',
                path: '/profile',
                icon: FaUser
            },
            {
                label: 'UserInfo',
                path: '/UserInfo',
                icon: FaUser
            },
            {
                label: 'Logout',
                icon: FaSignOutAlt,
                onClick: handleLogout
            }
        ]
    }
];

/**
 * Menu untuk pengguna yang sudah login (Mobile)
 * @param {Function} handleLogout 
 */
export const authMobileMenuItems = (handleLogout) => [
    { 
        label: 'Beranda', 
        path: '/',
        icon: FaHome, 
    },
    {
        label: 'User', 
        icon: FaUser,
        children: [
            {
                label: 'Profil',
                path: '/profile',
                icon: FaUser
            },
            {
                label: 'Logout',
                icon: FaSignOutAlt,
                onClick: handleLogout
            }
        ]
    }
];

/**
 * Menu untuk pengguna tamu (Desktop)
 * @param {Function} onLogin, onRegister, onOpenModal, onOtp 
 */
export const guestDesktopMenuItems = (onLogin, onRegister, onOpenModal, onOtp) => [
    { 
        label: 'Beranda', 
        path: '/',
        icon: FaHome,
    },
    { 
        label: 'Login', 
        path: '/auth/login',
        icon: FaSignInAlt,
        onClick: onOpenModal,
    },
];

/**
 * Menu untuk pengguna tamu (Mobile)
 * @param {Function} onLogin, onRegister, onOpenModal, onOtp 
 */
export const guestMobileMenuItems = (onLogin, onRegister, onOpenModal, onOtp) => [
    { 
        label: 'Beranda', 
        path: '/',
        icon: FaHome,
    },
    { 
        label: 'Login', 
        path: '/auth/login',
        icon: FaSignInAlt,
        onClick: onOpenModal,
    },
];
