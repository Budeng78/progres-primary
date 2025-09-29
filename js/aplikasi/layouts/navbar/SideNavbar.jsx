// resources/js/aplikasi/layouts/navbar/SideNavbar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";

const MenuItem = ({ item, location, depth = 0 }) => {
    const [open, setOpen] = useState(false);

    // Ukuran font & ikon konsisten
    const textSize = "text-base";
    const iconSize = "text-sm";

    // Indentasi + border untuk level child
    const borderClass =
        depth > 0 ? `ml-4 border-l border-gray-200 pl-3` : "";

    if (item.children && item.children.length > 0) {
        return (
            <div className={borderClass}>
                <button
                    onClick={() => setOpen(!open)}
                    className={`w-full text-left flex items-center justify-between p-2 rounded-lg transition-colors duration-200 text-gray-600 hover:bg-gray-100 ${textSize}`}
                >
                    <div className="flex items-center space-x-3">
                        <span className={iconSize}>
                            {item.icon && <item.icon />}
                        </span>
                        <span>{item.label}</span>
                    </div>
                    <span
                        className={`transition-transform duration-200 ${
                            open ? "rotate-90" : ""
                        }`}
                    >
                        <FaAngleRight />
                    </span>
                </button>

                {open && (
                    <ul className="ml-2 mt-1 space-y-1">
                        {item.children.map((child, index) => (
                            <li key={index}>
                                <MenuItem
                                    item={child}
                                    location={location}
                                    depth={depth + 1}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }

    if (item.onClick) {
        return (
            <div className={borderClass}>
                <button
                    onClick={item.onClick}
                    className={`w-full text-left flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 text-gray-600 hover:bg-gray-100 ${textSize}`}
                >
                    <span className={iconSize}>
                        {item.icon && <item.icon />}
                    </span>
                    <span>{item.label}</span>
                </button>
            </div>
        );
    }

    return (
        <div className={borderClass}>
            <Link
                to={item.path}
                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 ${textSize} ${
                    location.pathname === item.path
                        ? "bg-blue-100 text-blue-600 font-semibold"
                        : "text-gray-600 hover:bg-gray-100"
                }`}
            >
                <span className={iconSize}>{item.icon && <item.icon />}</span>
                <span>{item.label}</span>
            </Link>
        </div>
    );
};

const SideNavbar = ({ menuItems }) => {
    const location = useLocation();

    if (!menuItems || menuItems.length === 0) return null;

    return (
        // ********************************************
        // * PERUBAHAN UTAMA: Tambahkan print:hidden *
        // ********************************************
        <nav className="hidden md:block fixed top-16 left-0 h-full bg-white shadow-xl z-40 p-4 overflow-y-auto w-56 **print:hidden**">
            <div className="flex flex-col h-full justify-between">
                <ul className="space-y-2">
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            <MenuItem
                                item={item}
                                location={location}
                                depth={0}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default SideNavbar;