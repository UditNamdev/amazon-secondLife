// frontend/src/App.jsx
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TopBar from "./components/TopBar";
import SellerReturnFlow from "./features/seller/SellerReturnFlow";
import GradingResult from "./features/seller/GradingResult";
import BuyerMarketplace from "./features/buyer/BuyerMarketplace";
import ItemDetail from "./features/buyer/ItemDetail";
import GreenCredits from "./features/credits/GreenCredits";

export default function App() {
  // Global role state (shared across top navigation and page routes)
  const [role, setRole] = useState(() => {
    return localStorage.getItem("current_session_role") || "seller";
  });

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    localStorage.setItem("current_session_role", newRole);
  };

  return (
    <div className="min-h-screen bg-amazon-bg flex flex-col font-sans">
      {/* Top Header Navigation */}
      <TopBar currentRole={role} onRoleChange={handleRoleChange} />

      {/* Pages Container */}
      <div className="flex-grow py-6">
        <Routes>
          {/* Main returns wizard (Default page) */}
          <Route path="/" element={<Navigate to="/seller/return" replace />} />
          <Route path="/seller/return" element={<SellerReturnFlow role={role} />} />
          
          {/* Grading results */}
          <Route path="/seller/result/:id" element={<GradingResult role={role} />} />
          
          {/* Buyer marketplace */}
          <Route path="/buyer" element={<BuyerMarketplace role={role} />} />
          
          {/* Product Detail checkout */}
          <Route path="/buyer/item/:id" element={<ItemDetail role={role} />} />
          
          {/* Green credits ledgers */}
          <Route path="/credits" element={<GreenCredits />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/seller/return" replace />} />
        </Routes>
      </div>

      {/* Subtle footer */}
      <footer className="py-8 bg-amazon-navy text-xs text-gray-400 text-center border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 space-y-1">
          <p>© 1996-2026, Amazon.com, Inc. or its affiliates. All rights reserved.</p>
          <p className="text-gray-500">SecondLife Circular Commerce Returns grading platform verified by Google Gemini AI vision.</p>
        </div>
      </footer>
    </div>
  );
}
