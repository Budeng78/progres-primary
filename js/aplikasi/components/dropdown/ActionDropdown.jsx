// resources/js/aplikasi/components/dropdown/ActionDropdown.jsx
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";
import {
  FaEye,
  FaPencilAlt,
  FaTrashAlt,
} from "react-icons/fa";

const ActionDropdown = ({ actions = [] }) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        open &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const menu = (
    <div
      ref={menuRef}
      className="fixed z-50 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-2"
      style={{ top: coords.top, left: coords.left }}
    >
      {actions.map((action, idx) => (
        <div
          key={idx}
          onClick={() => {
            setOpen(false);
            action.onClick?.();
          }}
          className={`flex items-center gap-2 px-4 py-2 text-sm cursor-pointer 
            hover:bg-gray-50 
            transition-colors duration-150 
            ${action.danger ? "text-red-600 hover:bg-red-50" : "text-gray-700"}
          `}
        >
          {action.icon && <action.icon className="w-4 h-4 opacity-70" />}
          <span>{action.label}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="inline-block" ref={buttonRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="
          w-9 h-9 flex items-center justify-center
          rounded-full 
          bg-gray-100 text-gray-600
          shadow-sm hover:bg-gray-200
          transition
        "
      >
        <MoreVertical className="w-5 h-5" />
      </button>
      {open && createPortal(menu, document.body)}
    </div>
  );
};

export default ActionDropdown;
