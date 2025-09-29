// resources/js/components/TopNavBar.jsx
import React from 'react';
import YourLogo from '../../assets/img/logo_mc-wartono.png'; 

function TopNavBar() {
    return (
        <header className="fixed top-0 left-0 w-full p-4 bg-blue-900 text-white flex justify-between items-center shadow-md z-50 no-print">
            {/* Logo + Nama Perusahaan */}
            <div className="flex items-center">
                <img 
                    src={YourLogo} 
                    alt="Logo Aplikasi Anda" 
                    className="h-10 hover:scale-110 transition-transform duration-300"
                />
                <span className="ml-3 text-base md:text-lg font-semibold tracking-wide">
                    PT. SUKUN WARTONO INDONESIA
                </span>
            </div>

            {/* Slot untuk tombol/menu di sebelah kanan */}
            <div className="hidden md:flex items-center space-x-4">
                {/* Contoh: */}
                {/* <button className="px-3 py-1 rounded-md bg-blue-700 hover:bg-blue-600">Menu</button> */}
            </div>
        </header>
    );
}

export default TopNavBar;
