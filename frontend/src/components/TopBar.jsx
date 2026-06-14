// frontend/src/components/TopBar.jsx
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Leaf, RefreshCw, Heart } from "lucide-react";

export default function TopBar({ currentRole, onRoleChange }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Just take the buyer to the marketplace for demo search
      navigate("/buyer");
    }
  };

  return (
    <div className="flex flex-col font-sans w-full sticky top-0 z-50 shadow-md">
      {/* Primary Top Bar */}
      <div className="bg-amazon-navy text-white px-4 py-2 flex items-center justify-between gap-4 select-none">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-1.5 py-1 px-2 hover:outline-1 hover:outline-white">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-sm">
            <RefreshCw className="w-5 h-5 text-gray-900 stroke-[3]" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display font-extrabold text-lg tracking-tight">
              amazon
            </span>
            <span className="text-[10px] text-amber-400 font-bold -mt-0.5 tracking-wider uppercase">
              SecondLife
            </span>
          </div>
        </Link>

        {/* Central Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-grow max-w-2xl hidden md:flex items-center h-10 rounded-md overflow-hidden bg-white">
          <select className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 h-full border-r border-gray-300 focus:outline-none cursor-pointer">
            <option>Used Deals</option>
            <option>All Departments</option>
            <option>Climate Pledge</option>
          </select>
          <input
            type="text"
            placeholder="Search returned, open-box, or certified used items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow h-full px-3 text-sm text-gray-900 focus:outline-none"
          />
          <button type="submit" className="bg-amazon-yellow hover:bg-amazon-yellowHover text-gray-900 h-full px-5 flex items-center justify-center transition-colors border-none">
            <Search className="w-5 h-5 stroke-[2.5]" />
          </button>
        </form>

        {/* Right Side Links */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          
          {/* Role Switcher Pill inside header */}
          <div className="bg-gray-800 border border-gray-700 rounded-full p-0.5 flex items-center shadow-inner">
            {["buyer", "seller", "donor", "ngo"].map((role) => (
              <button
                key={role}
                onClick={() => onRoleChange(role)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  currentRole === role
                    ? "bg-amazon-yellow text-gray-900 shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Green Credits indicator */}
          <Link to="/credits" className="flex items-center gap-1.5 py-1 px-2 hover:outline-1 hover:outline-white text-emerald-400">
            <Leaf className="w-4 h-4 fill-current" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-normal leading-tight">Eco Balance</span>
              <span className="font-bold text-sm leading-tight text-white">450 Cr</span>
            </div>
          </Link>

          {/* Returns link */}
          <Link to="/seller/return" className="py-1 px-2 hover:outline-1 hover:outline-white hidden sm:block">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-normal leading-tight">Returns &</span>
              <span className="font-bold leading-tight">AI Grading</span>
            </div>
          </Link>

          {/* Cart Icon */}
          <Link to="/buyer" className="flex items-end gap-1 py-1 px-2 hover:outline-1 hover:outline-white">
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-1 left-2 bg-orange-600 text-white rounded-full text-[9px] w-4.5 h-4.5 flex items-center justify-center font-bold">
                1
              </span>
            </div>
            <span className="font-bold hidden sm:inline">Cart</span>
          </Link>

        </div>

      </div>

      {/* Secondary Bar */}
      <div className="bg-amazon-navyLight text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-between select-none">
        <div className="flex items-center gap-4">
          <span className="cursor-pointer hover:underline">All</span>
          <NavLink
            to="/seller/return"
            className={({ isActive }) =>
              `hover:underline ${isActive ? "text-amber-400 font-bold" : ""}`
            }
          >
            Sell / Return Form
          </NavLink>
          <NavLink
            to="/buyer"
            className={({ isActive }) =>
              `hover:underline ${isActive ? "text-amber-400 font-bold" : ""}`
            }
          >
            Certified Used Store
          </NavLink>
          <NavLink
            to="/credits"
            className={({ isActive }) =>
              `hover:underline ${isActive ? "text-amber-400 font-bold" : ""}`
            }
          >
            Green Credits Hub
          </NavLink>
          <NavLink
            to="/donations"
            className={({ isActive }) =>
              `hover:underline flex items-center gap-1 ${isActive ? "text-amber-400 font-bold" : "text-emerald-400"}`
            }
          >
            <Heart className="w-3 h-3 fill-current" />
            Smart Donations
          </NavLink>
          <span className="text-emerald-400 flex items-center gap-1 cursor-pointer hover:underline">
            <Leaf className="w-3.5 h-3.5 fill-current" /> Climate Pledge Friendly
          </span>
        </div>
        <div className="text-[11px] text-gray-300 hidden md:block">
          Active Session Role: <span className="font-bold text-white uppercase">{currentRole}</span>
        </div>
      </div>
    </div>
  );
}
