// frontend/src/components/GradeBadge.jsx
import React from "react";

/**
 * Component to display color-coded AI condition grade badge.
 * @param {object} props
 * @param {string} props.grade - The grade value (e.g. New, Like New, Very Good, Good, Acceptable, Damaged)
 * @param {string} props.size - 'sm', 'md', 'lg'
 */
export default function GradeBadge({ grade, size = "md" }) {
  const getStyles = () => {
    const g = String(grade || "").trim();
    if (g === "New" || g === "Like New") {
      return {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-300",
        label: "New / Mint",
      };
    }
    if (g === "Very Good") {
      return {
        bg: "bg-blue-50 text-blue-700 border-blue-300",
        label: "Very Good",
      };
    }
    if (g === "Good" || g === "Acceptable") {
      return {
        bg: "bg-amber-50 text-amber-700 border-amber-300",
        label: "Good / Used",
      };
    }
    return {
      bg: "bg-rose-50 text-rose-700 border-rose-300",
      label: "Damaged / Scrap",
    };
  };

  const styles = getStyles();
  
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs font-semibold border rounded",
    md: "px-3 py-1 text-sm font-bold border rounded-md shadow-sm",
    lg: "px-5 py-2.5 text-lg font-black border-2 rounded-xl shadow-md tracking-wide",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-sans ${sizeClasses[size]} ${styles.bg}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {styles.label} ({grade})
    </span>
  );
}
