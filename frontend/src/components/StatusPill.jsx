// frontend/src/components/StatusPill.jsx
import React from "react";

export default function StatusPill({ status }) {
  const getStyles = () => {
    const s = String(status || "").toLowerCase();
    if (s === "graded" || s === "resell" || s === "restock") {
      return "bg-green-100 text-green-800 border-green-200";
    }
    if (s === "refurbish" || s === "refurbished") {
      return "bg-blue-100 text-blue-800 border-blue-200";
    }
    if (s === "donate" || s === "donated" || s === "ngo") {
      return "bg-purple-100 text-purple-800 border-purple-200";
    }
    if (s === "recycle" || s === "recycled" || s === "scrap") {
      return "bg-gray-100 text-gray-800 border-gray-200";
    }
    return "bg-amber-100 text-amber-800 border-amber-200";
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold border rounded-full uppercase tracking-wider ${getStyles()}`}>
      {status}
    </span>
  );
}
