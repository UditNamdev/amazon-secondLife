// frontend/src/components/ValueCard.jsx
import React from "react";
import { Leaf, Award, DollarSign } from "lucide-react";

export default function ValueCard({ label, value, type = "default", subtitle = "" }) {
  const getStyle = () => {
    switch (type) {
      case "green":
        return {
          bg: "bg-emerald-50 border-emerald-200",
          icon: <Leaf className="w-5 h-5 text-amazon-green fill-current" />,
          color: "text-amazon-green"
        };
      case "currency":
        return {
          bg: "bg-orange-50 border-orange-200",
          icon: <DollarSign className="w-5 h-5 text-amazon-red" />,
          color: "text-amazon-red"
        };
      default:
        return {
          bg: "bg-blue-50 border-blue-200",
          icon: <Award className="w-5 h-5 text-amazon-navy" />,
          color: "text-amazon-navy"
        };
    }
  };

  const style = getStyle();

  return (
    <div className={`p-4 border rounded-lg shadow-sm flex items-start gap-3 w-full ${style.bg}`}>
      <div className="p-2 bg-white rounded-md shadow-xs border border-gray-100 flex-shrink-0">
        {style.icon}
      </div>
      <div>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
          {label}
        </span>
        <span className={`text-xl font-bold tracking-tight block ${style.color}`}>
          {value}
        </span>
        {subtitle && (
          <span className="text-xs font-medium text-gray-400 mt-0.5 block">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
