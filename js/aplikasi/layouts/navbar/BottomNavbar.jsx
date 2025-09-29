// resources/js/aplikasi/layouts/navbar/BottomNavbar.jsx

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const BottomNavbar = ({ menuItems }) => {
    const location = useLocation();
    const [activeDropdown, setActiveDropdown] = useState(null);

    const handleDropdownToggle = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    return (
        <>
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md z-50 md:hidden no-print">
                <ul className="flex justify-around items-center py-2">
                    {menuItems.map((item, index) => (
                        <li key={index} className="relative">
                            {item.children ? (
                                <button
                                    onClick={() => handleDropdownToggle(index)}
                                    className={`flex flex-col items-center text-xs ${
                                        activeDropdown === index ? 'text-blue-600 font-semibold' : 'text-gray-500'
                                    }`}
                                >
                                    <div className="text-xl mb-1">{item.icon && <item.icon />}</div>
                                    {item.label}
                                </button>
                            ) : item.onClick ? (
                                <button
                                    onClick={item.onClick}
                                    className="flex flex-col items-center text-xs text-gray-500 hover:text-blue-600"
                                >
                                    <div className="text-xl mb-1">{item.icon && <item.icon />}</div>
                                    {item.label}
                                </button>
                            ) : (
                                <Link
                                    to={item.path}
                                    className={`flex flex-col items-center text-xs ${
                                        location.pathname === item.path ? 'text-blue-600 font-semibold' : 'text-gray-500'
                                    }`}
                                >
                                    <div className="text-xl mb-1">{item.icon && <item.icon />}</div>
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
            {/* The dropdown card is now needed again to show the user's profile and logout */}
            <AnimatePresence>
                {activeDropdown !== null && menuItems[activeDropdown].children && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 backdrop-blur-sm bg-white/5 z-40"
                            onClick={() => setActiveDropdown(null)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            />

                        {/* Card */}
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg z-50 w-72 p-4"
                        >
                            <ul className="space-y-2 text-sm">
                                {menuItems[activeDropdown].children.map((child, idx) => (
                                    <li key={idx}>
                                        {child.onClick ? (
                                            <button
                                                onClick={() => {
                                                    child.onClick();
                                                    setActiveDropdown(null);
                                                }}
                                                className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-gray-700"
                                            >
                                                <span className="flex items-center space-x-2">
                                                    <span className="text-lg">{child.icon && <child.icon />}</span>
                                                    <span>{child.label}</span>
                                                </span>
                                            </button>
                                        ) : (
                                            <Link
                                                to={child.path}
                                                onClick={() => setActiveDropdown(null)}
                                                className={`block px-3 py-2 rounded hover:bg-gray-100 text-gray-700 ${
                                                    location.pathname === child.path ? 'font-semibold text-blue-600' : ''
                                                }`}
                                            >
                                                <span className="flex items-center space-x-2">
                                                    <span className="text-lg">{child.icon && <child.icon />}</span>
                                                    <span>{child.label}</span>
                                                </span>
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default BottomNavbar;