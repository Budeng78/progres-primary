// resources/js/components/ui/Card.jsx
import React from "react";

export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white shadow-md rounded-2xl p-6 ${className}`}
    >
      {children}
    </div>
  );
}
