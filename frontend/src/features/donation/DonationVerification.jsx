import React, { useState, useEffect } from "react";
import { ShieldCheck, Plus, Sparkles, Leaf, Users, BarChart2 } from "lucide-react";
import { listDonations, generateDemoPayload, createDonation, seedDemoIfEmpty } from "../../services/donationStore";
import DonorDashboard from "./dashboards/DonorDashboard";
import BuyerDashboard from "./dashboards/BuyerDashboard";
import NGODashboard from "./dashboards/NGODashboard";
import SellerDashboard from "./dashboards/SellerDashboard";

const DEMO_ITEMS = [
  { label: "Baby Monitor", emoji: "👶" },
  { label: "MacBook Air", emoji: "💻" },
  { label: "Engineering Books", emoji: "📚" },
  { label: "Study Chair", emoji: "🪑" },
  { label: "Winter Jacket", emoji: "🧥" },
];

function StatsBar({ donations }) {
  const totalCredits = donations.reduce((s, d) => s + (d.green_credits || 0), 0);
  const verified = donations.filter((d) => d.status === "CREDITS_RELEASED" || d.status === "VERIFIED").length;
  const totalCarbon = donations.length * 2.8;

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {[
        { icon: Leaf, label: "Green Credits Earned", value: `${totalCredits} Cr`, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-100" },
        { icon: ShieldCheck, label: "Verified Donations", value: verified, color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-100" },
        { icon: BarChart2, label: "CO₂ Saved (est.)", value: `${totalCarbon.toFixed(1)} kg`, color: "text-amazon-teal", bg: "bg-cyan-50", border: "border-cyan-100" },
      ].map(({ icon: Icon, label, value, color, bg, border }) => (
        <div key={label} className={`${bg} border ${border} rounded-xl p-4 text-center hover:-translate-y-0.5 transition-transform`}>
          <Icon className={`w-5 h-5 ${color} mx-auto mb-1.5`} />
          <p className={`text-lg font-black ${color}`}>{value}</p>
          <p className="text-[10px] text-gray-500 font-semibold mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onGenerate, generating }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-amazon-teal to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
        <Sparkles className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-lg font-bold text-gray-900 mb-2">No active donations yet</h2>
      <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
        Load a sample donation to see the full AI decision-making flow — recipient matching, product passport, and impact tracking.
      </p>

      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {DEMO_ITEMS.map((item) => (
          <button
            key={item.label}
            onClick={() => onGenerate()}
            disabled={generating}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 hover:border-amazon-teal hover:bg-cyan-50 text-xs font-semibold rounded-full transition-all cursor-pointer"
          >
            <span>{item.emoji}</span> {item.label}
          </button>
        ))}
      </div>

      <button
        onClick={onGenerate}
        disabled={generating}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-amazon-teal text-white font-bold rounded-full shadow hover:bg-cyan-700 hover:scale-105 transition-all disabled:opacity-50"
      >
        <Plus className="w-4 h-4" />
        {generating ? "Generating..." : "Generate Demo Donation"}
      </button>
    </div>
  );
}

export default function DonationVerification({ role }) {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const loadDonations = () => {
    setDonations(listDonations());
    setLoading(false);
  };

  useEffect(() => {
    // Seed a rich demo item if store is empty for first-time visitors
    seedDemoIfEmpty();
    loadDonations();
    const interval = setInterval(loadDonations, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      createDonation(generateDemoPayload());
      loadDonations();
      setGenerating(false);
    }, 600);
  };

  const roleContext = {
    donor: {
      title: "Donor Handover Hub",
      desc: "Manage your pending physical handovers and track incoming Green Credits.",
    },
    buyer: {
      title: "Recipient Verification Hub",
      desc: "Safely receive donated items. Scan QR codes to verify handover and confirm condition.",
    },
    ngo: {
      title: "NGO Operations Command",
      desc: "Aggregate view of incoming donations, pending pickups, and community impact.",
    },
    seller: {
      title: "Item Recovery & Routing",
      desc: "Track the post-return lifecycle of your item and see AI routing decisions.",
    },
  };

  const currentContext = roleContext[role] || roleContext.buyer;

  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="w-8 h-8 border-2 border-amazon-teal border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 font-sans space-y-6">

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-amazon-teal to-cyan-800 p-6 rounded-xl text-white shadow-md flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-cyan-300" /> {currentContext.title}
          </h1>
          <p className="text-sm text-cyan-100 mt-1 max-w-lg">{currentContext.desc}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="hidden sm:block text-right">
            <div className="text-[10px] uppercase font-bold text-cyan-200 tracking-widest mb-1">Active Persona</div>
            <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold uppercase backdrop-blur-sm border border-white/30">
              {role}
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white text-[11px] font-bold rounded-full transition-all disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            {generating ? "Adding..." : "Add Demo Item"}
          </button>
        </div>
      </div>

      {/* ── Stats Bar (only if we have donations) ── */}
      {donations.length > 0 && <StatsBar donations={donations} />}

      {/* ── Dashboard Routing ── */}
      {donations.length === 0 && role !== "ngo" && role !== "seller" ? (
        <EmptyState onGenerate={handleGenerate} generating={generating} />
      ) : (
        <div className="space-y-6">
          {role === "donor" && donations.map((d) => (
            <DonorDashboard key={d.id} donation={d} onUpdate={loadDonations} />
          ))}
          {role === "buyer" && donations.map((d) => (
            <BuyerDashboard key={d.id} donation={d} onUpdate={loadDonations} />
          ))}
          {role === "ngo" && <NGODashboard donations={donations} />}
          {role === "seller" && <SellerDashboard donations={donations} />}
        </div>
      )}

    </div>
  );
}
