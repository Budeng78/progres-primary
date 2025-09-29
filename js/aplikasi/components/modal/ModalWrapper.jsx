// resources/js/aplikasi/components/ModalWrapper.jsx
import React from "react";

const ModalWrapper = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* background blur */}
      <div className="absolute inset-0 bg-opacity-50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-xl p-6 w-[500px] relative z-10">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition duration-300"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalWrapper;
