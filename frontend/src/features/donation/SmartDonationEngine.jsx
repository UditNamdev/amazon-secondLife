// frontend/src/features/donation/SmartDonationEngine.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createDonation } from "../../services/donationStore";
import {
  Heart, Users, Building2, Sparkles, MapPin, Leaf,
  TrendingDown, CheckCircle, ChevronDown, ChevronUp,
  Zap, Award, ArrowRight, Info, Package, Globe
} from "lucide-react";

// ─── AI Matching Engine (client-side simulation) ────────────────────────────

function getNGOMatch(category, gradeVal) {
  const map = {
    electronics: { org: "Digital Education NGO", impact: "Enables digital learning for underprivileged students", icon: "🎓", distance: 28 },
    laptop: { org: "Digital Education NGO", impact: "Supports coding bootcamps for rural youth", icon: "🎓", distance: 28 },
    drone: { org: "Disaster Relief NGO", impact: "Used for aerial survey in flood-hit regions", icon: "🚁", distance: 35 },
    footwear: { org: "Community Support NGO", impact: "Distributed to homeless shelters & winter drives", icon: "👟", distance: 22 },
    clothing: { org: "Community Support NGO", impact: "Reaches 50+ families via Goonj winter drive", icon: "👕", distance: 22 },
    appliance: { org: "Community Kitchen NGO", impact: "Powers community nutrition programs", icon: "🍳", distance: 19 },
    books: { org: "Student Literacy NGO", impact: "Stocked in 12 rural school libraries", icon: "📚", distance: 15 },
    baby: { org: "Child Welfare NGO", impact: "Supports 200+ infants in underprivileged homes", icon: "👶", distance: 12 },
  };
  const key = Object.keys(map).find((k) => category.toLowerCase().includes(k)) || "electronics";
  const match = map[key];
  return {
    ...match,
    logisticsCost: 300,
    co2: 4.2,
    credits: computeDynamicCredits("ngo", gradeVal, match.distance),
  };
}

function getP2PMatch(category, gradeVal, model) {
  const personas = [
    { recipient: "Rohan M.", type: "Engineering student", need: "Study Aid", distance: 2.1, emoji: "🎓" },
    { recipient: "Priya S.", type: "New parent", need: "Baby care", distance: 1.4, emoji: "👶" },
    { recipient: "Anjali K.", type: "Home cook", need: "Kitchen upgrade", distance: 3.0, emoji: "🍳" },
    { recipient: "Dev T.", type: "Startup founder", need: "Work-from-home kit", distance: 2.7, emoji: "💼" },
    { recipient: "Meera L.", type: "College student", need: "Learning resources", distance: 1.8, emoji: "📚" },
    { recipient: "Arjun P.", type: "NGO volunteer", need: "Field equipment", distance: 4.2, emoji: "🌍" },
  ];
  // deterministic seed from model name length for consistent demo
  const seed = (model?.length || 5) % personas.length;
  const persona = personas[seed];
  return {
    ...persona,
    logisticsCost: 50,
    co2: 0.6,
    credits: computeDynamicCredits("p2p", gradeVal, persona.distance),
  };
}

function computeDynamicCredits(type, gradeVal, distance) {
  const base = type === "ngo" ? 30 : 60;
  const gradeBonus = { New: 15, "Like New": 12, "Very Good": 10, Good: 7, Acceptable: 5, Damaged: 2 }[gradeVal] || 5;
  const distanceSaved = type === "p2p" ? Math.max(0, (30 - distance) * 0.8) : 0;
  const sustainabilityBonus = type === "p2p" ? 20 : 10;
  const logisticsFactor = type === "ngo" ? -5 : -2;
  const total = Math.round(base + gradeBonus + distanceSaved + sustainabilityBonus + logisticsFactor);
  return {
    total,
    breakdown: [
      { label: "Base Credits", value: `+${base}`, positive: true },
      { label: "Grade Bonus", value: `+${gradeBonus}`, positive: true },
      ...(distanceSaved > 0 ? [{ label: "Local Reuse Bonus", value: `+${Math.round(distanceSaved)}`, positive: true }] : []),
      { label: "Sustainability Bonus", value: `+${sustainabilityBonus}`, positive: true },
      { label: "Logistics Cost Factor", value: `${logisticsFactor}`, positive: false },
    ],
  };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function DestinationCard({ id, icon: Icon, title, subtitle, selected, onClick, color }) {
  const colors = {
    yellow: "border-amber-400 bg-amber-50 ring-amber-300",
    teal: "border-amazon-teal bg-cyan-50 ring-cyan-200",
    green: "border-emerald-500 bg-emerald-50 ring-emerald-200",
  };
  const iconColors = { yellow: "text-amber-500", teal: "text-amazon-teal", green: "text-emerald-600" };
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      className={`flex-1 min-w-[120px] p-4 border-2 rounded-xl text-left transition-all cursor-pointer group ${
        selected
          ? `${colors[color]} ring-2 shadow-sm`
          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60"
      }`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selected ? "bg-white shadow-sm" : "bg-gray-100 group-hover:bg-white"}`}>
          <Icon className={`w-4 h-4 ${selected ? iconColors[color] : "text-gray-500"}`} />
        </div>
        {selected && (
          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
            color === "yellow" ? "bg-amber-400 text-amber-900" :
            color === "teal" ? "bg-amazon-teal text-white" :
            "bg-emerald-500 text-white"
          }`}>Selected</span>
        )}
      </div>
      <p className={`text-sm font-bold ${selected ? "text-gray-900" : "text-gray-700"}`}>{title}</p>
      <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">{subtitle}</p>
    </button>
  );
}

function CreditBreakdown({ breakdown, total, color }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-gray-800 transition-colors"
      >
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        {open ? "Hide" : "Show"} credit breakdown
      </button>
      {open && (
        <div className="mt-2 space-y-1 p-3 bg-white/70 border border-gray-200 rounded-lg animate-fade-in">
          {breakdown.map((b, i) => (
            <div key={i} className="flex justify-between items-center text-[11px]">
              <span className="text-gray-600">{b.label}</span>
              <span className={`font-bold ${b.positive ? "text-emerald-600" : "text-rose-500"}`}>{b.value}</span>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-1.5 mt-1.5 flex justify-between">
            <span className="text-xs font-bold text-gray-800">Total Earned</span>
            <span className={`text-xs font-black ${color === "green" ? "text-emerald-700" : "text-amazon-teal"}`}>+{total} Cr</span>
          </div>
        </div>
      )}
    </div>
  );
}

function NGOCard({ ngo, gradeVal }) {
  return (
    <div className="border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 space-y-4 animate-fade-in shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">NGO Donation</span>
          </div>
          <h4 className="text-base font-extrabold text-gray-900">{ngo.icon} {ngo.org}</h4>
          <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{ngo.impact}</p>
        </div>
        <div className="flex flex-col items-center bg-white border border-emerald-200 rounded-lg px-3 py-2 shadow-xs flex-shrink-0">
          <span className="text-[9px] text-gray-500 font-bold uppercase">Credits</span>
          <span className="text-2xl font-black text-emerald-700 leading-tight">+{ngo.credits.total}</span>
          <span className="text-[9px] text-emerald-600 font-semibold">Cr earned</span>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: MapPin, label: "Distance", value: `${ngo.distance} km`, color: "text-rose-500" },
          { icon: TrendingDown, label: "Logistics Cost", value: `₹${ngo.logisticsCost}`, color: "text-amber-600" },
          { icon: Globe, label: "CO₂ Impact", value: `${ngo.co2} kg`, color: "text-emerald-600" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white/80 rounded-lg p-2.5 text-center border border-white shadow-xs">
            <Icon className={`w-4 h-4 mx-auto mb-1 ${color}`} />
            <p className="text-[10px] text-gray-500">{label}</p>
            <p className="text-xs font-bold text-gray-800">{value}</p>
          </div>
        ))}
      </div>

      {/* Amazon logistics badge */}
      <div className="bg-emerald-700/10 border border-emerald-200 rounded-lg px-3 py-2 flex items-center gap-2">
        <Package className="w-4 h-4 text-emerald-700 flex-shrink-0" />
        <p className="text-[11px] text-emerald-900 font-semibold">
          Amazon will collect and deliver this item to a <span className="font-bold">verified NGO partner</span>.
        </p>
      </div>

      {/* Condition & grade */}
      <div className="flex items-center justify-between text-xs text-gray-600">
        <span>Product condition: <strong>{gradeVal}</strong></span>
        <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded-full">Eligible for NGO</span>
      </div>

      <CreditBreakdown breakdown={ngo.credits.breakdown} total={ngo.credits.total} color="green" />
    </div>
  );
}

function P2PCard({ p2p, gradeVal }) {
  return (
    <div className="border border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-5 space-y-4 animate-fade-in shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Users className="w-4 h-4 text-amazon-teal" />
            <span className="text-[10px] font-bold text-amazon-teal uppercase tracking-wider">Community Donation</span>
            {/* Live pulse badge */}
            <span className="flex items-center gap-1 bg-emerald-100 border border-emerald-300 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              Best Match Found
            </span>
          </div>
          <h4 className="text-base font-extrabold text-gray-900">{p2p.emoji} {p2p.recipient}</h4>
          <p className="text-xs text-gray-600 mt-0.5">{p2p.type} · Needs: <span className="font-semibold">{p2p.need}</span></p>
        </div>
        <div className="flex flex-col items-center bg-white border border-cyan-200 rounded-lg px-3 py-2 shadow-xs flex-shrink-0">
          <span className="text-[9px] text-gray-500 font-bold uppercase">Credits</span>
          <span className="text-2xl font-black text-amazon-teal leading-tight">+{p2p.credits.total}</span>
          <span className="text-[9px] text-amazon-teal font-semibold">Cr earned</span>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: MapPin, label: "Distance", value: `${p2p.distance} km`, color: "text-amazon-teal" },
          { icon: TrendingDown, label: "Logistics Cost", value: `₹${p2p.logisticsCost}`, color: "text-emerald-600" },
          { icon: Globe, label: "CO₂ Impact", value: `${p2p.co2} kg`, color: "text-blue-500" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white/80 rounded-lg p-2.5 text-center border border-white shadow-xs">
            <Icon className={`w-4 h-4 mx-auto mb-1 ${color}`} />
            <p className="text-[10px] text-gray-500">{label}</p>
            <p className="text-xs font-bold text-gray-800">{value}</p>
          </div>
        ))}
      </div>

      {/* Impact chip row */}
      <div className="flex flex-wrap gap-2">
        <span className="bg-amazon-teal/10 text-amazon-teal text-[10px] font-bold px-2 py-1 rounded-full border border-amazon-teal/20">
          🌱 Lower carbon footprint
        </span>
        <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full border border-blue-200">
          ⚡ Immediate reuse
        </span>
        <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-1 rounded-full border border-purple-200">
          🏘️ Hyperlocal match
        </span>
      </div>

      <CreditBreakdown breakdown={p2p.credits.breakdown} total={p2p.credits.total} color="teal" />
    </div>
  );
}

function AIComparisonPanel({ ngo, p2p, onSelectNGO, onSelectP2P, selectedFinal }) {
  const p2pWins = p2p.credits.total > ngo.credits.total;

  return (
    <div className="border border-gray-200 bg-white rounded-xl p-5 shadow-sm animate-fade-in mt-4">
      {/* AI Chip header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-gradient-to-br from-amazon-teal to-blue-600 p-1.5 rounded-lg">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-xs font-extrabold text-gray-900">AI Recommendation Engine</p>
          <p className="text-[10px] text-gray-500">Analysing logistics cost, carbon impact & reuse probability</p>
        </div>
      </div>

      {/* Comparison columns */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* NGO column */}
        <div className={`rounded-xl border-2 p-3.5 transition-all ${selectedFinal === "ngo" ? "border-emerald-400 bg-emerald-50" : "border-gray-200 bg-gray-50"}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-emerald-700 uppercase flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" /> NGO Donation
            </span>
            {!p2pWins && (
              <span className="text-[9px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded-full">Recommended</span>
            )}
          </div>
          <div className="space-y-1.5 text-[11px] text-gray-700">
            <div className="flex justify-between"><span>Distance</span><strong>{ngo.distance} km</strong></div>
            <div className="flex justify-between"><span>Logistics Cost</span><strong className="text-rose-600">₹{ngo.logisticsCost}</strong></div>
            <div className="flex justify-between"><span>CO₂ Impact</span><strong>{ngo.co2} kg</strong></div>
            <div className="flex justify-between border-t border-gray-200 pt-1.5 mt-1.5">
              <span className="font-bold">Green Credits</span>
              <strong className="text-emerald-700 text-sm">+{ngo.credits.total} Cr</strong>
            </div>
          </div>
        </div>

        {/* P2P column */}
        <div className={`rounded-xl border-2 p-3.5 transition-all ${selectedFinal === "p2p" ? "border-amazon-teal bg-cyan-50" : "border-gray-200 bg-gray-50"}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-amazon-teal uppercase flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> P2P Donation
            </span>
            {p2pWins && (
              <span className="text-[9px] bg-amazon-teal text-white font-bold px-1.5 py-0.5 rounded-full">Recommended</span>
            )}
          </div>
          <div className="space-y-1.5 text-[11px] text-gray-700">
            <div className="flex justify-between"><span>Distance</span><strong>{p2p.distance} km</strong></div>
            <div className="flex justify-between"><span>Logistics Cost</span><strong className="text-emerald-600">₹{p2p.logisticsCost}</strong></div>
            <div className="flex justify-between"><span>CO₂ Impact</span><strong>{p2p.co2} kg</strong></div>
            <div className="flex justify-between border-t border-gray-200 pt-1.5 mt-1.5">
              <span className="font-bold">Green Credits</span>
              <strong className="text-amazon-teal text-sm">+{p2p.credits.total} Cr</strong>
            </div>
          </div>
        </div>
      </div>

      {/* AI Narrative */}
      <div className="bg-gradient-to-r from-amazon-teal/5 to-blue-50 border border-amazon-teal/20 rounded-xl p-3.5 mb-4">
        <div className="flex items-start gap-2">
          <Zap className="w-4 h-4 text-amazon-teal flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-800 leading-relaxed">
            {p2pWins
              ? <>
                  <strong>Community Donation is the most sustainable option</strong> because it reduces logistics costs by <strong>₹{ngo.logisticsCost - p2p.logisticsCost}</strong> and cuts transportation emissions by <strong>{((ngo.co2 - p2p.co2) / ngo.co2 * 100).toFixed(0)}%</strong> while enabling immediate local reuse — earning you <strong>+{p2p.credits.total - ngo.credits.total} more Green Credits</strong>.
                </>
              : <>
                  <strong>NGO Donation is the most impactful option</strong> for this item category, connecting it directly with a verified NGO partner whose active need list matches this product — maximising social impact even with higher logistics costs.
                </>
            }
          </p>
        </div>
      </div>

      {/* Final selection buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          id="confirm-ngo-donation"
          onClick={() => onSelectNGO()}
          className={`py-2.5 rounded-full text-xs font-bold border-2 transition-all cursor-pointer ${
            selectedFinal === "ngo"
              ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
              : "bg-white border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          }`}
        >
          {selectedFinal === "ngo" ? "✅ NGO Donation Confirmed" : "Confirm NGO Donation"}
        </button>
        <button
          type="button"
          id="confirm-p2p-donation"
          onClick={() => onSelectP2P()}
          className={`py-2.5 rounded-full text-xs font-bold border-2 transition-all cursor-pointer ${
            selectedFinal === "p2p"
              ? "bg-amazon-teal border-amazon-teal text-white shadow-sm"
              : "bg-white border-cyan-300 text-amazon-teal hover:bg-cyan-50"
          }`}
        >
          {selectedFinal === "p2p" ? "✅ Community Donation Confirmed" : "Confirm P2P Donation"}
        </button>
      </div>
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export default function SmartDonationEngine({ item, gradeVal, category, model, onDonate }) {
  const navigate = useNavigate();
  const [step, setStep] = useState("destination"); // "destination" | "donate-options" | "confirmed"
  const [destination, setDestination] = useState(null); // "resell" | "refurbish" | "donate"
  const [donateType, setDonateType] = useState(null); // "ngo" | "p2p" | "both"
  const [selectedFinal, setSelectedFinal] = useState(null); // "ngo" | "p2p"
  const [confirming, setConfirming] = useState(false);

  const ngo = getNGOMatch(category, gradeVal);
  const p2p = getP2PMatch(category, gradeVal, model);

  const handleDestination = (dest) => {
    setDestination(dest);
    if (dest === "donate") {
      setStep("donate-options");
    }
  };

  const handleDonateType = (type) => {
    // Allow toggling both cards
    if (donateType === type) {
      setDonateType("both");
    } else if (donateType === "both") {
      setDonateType(type === "ngo" ? "p2p" : "ngo");
    } else if (donateType && donateType !== type) {
      setDonateType("both");
    } else {
      setDonateType(type);
    }
  };

  const handleConfirmNGO = async () => {
    if (confirming) return;
    setConfirming(true);
    setSelectedFinal("ngo");
    try {
      await onDonate({ type: "ngo", credits: ngo.credits.total, org: ngo.org });
    } catch (_) {}
    setConfirming(false);
    setStep("confirmed");
  };

  const handleConfirmP2P = async () => {
    if (confirming) return;
    setConfirming(true);
    setSelectedFinal("p2p");
    
    // Create record in localStorage store
    createDonation({
      product_id: item?.itemId || "unknown",
      productName: model || category,
      category: category,
      donor_id: "u_donor",
      donor_name: "Rahul M.", // mock donor
      recipient_id: "u_recip",
      recipient_name: p2p.recipient,
      recipient_type: p2p.type,
      distance: p2p.distance,
      need_score: 95,
      green_credits: p2p.credits.total
    });

    try {
      // Optional: still call parent onDonate if backend tracking needed
      await onDonate({ type: "p2p", credits: p2p.credits.total, recipient: p2p.recipient });
    } catch (_) {}
    setConfirming(false);
    
    // Navigate straight to the verification dashboard
    navigate("/donations");
  };

  const showComparison = donateType === "both";

  // ── Confirmed State ──
  if (step === "confirmed") {
    const isP2P = selectedFinal === "p2p";
    const winner = isP2P ? p2p : ngo;
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6 text-center space-y-4 animate-fade-in">
        <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-gray-900">Donation Confirmed! 🎉</h3>
          <p className="text-sm text-gray-600 mt-1">
            {isP2P
              ? `Your item is on its way to ${p2p.recipient} (${p2p.distance} km away).`
              : `Amazon will collect and deliver this to ${ngo.org}.`}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 bg-emerald-700 text-white px-5 py-2.5 rounded-full font-black text-sm shadow-md">
          <Leaf className="w-4 h-4 fill-current" />
          +{winner.credits.total} Green Credits Earned
        </div>
        <div className="grid grid-cols-3 gap-3 mt-2">
          {[
            { label: "Distance Saved", value: isP2P ? `${(ngo.distance - p2p.distance).toFixed(1)} km` : "—" },
            { label: "CO₂ Avoided", value: isP2P ? `${(ngo.co2 - p2p.co2).toFixed(1)} kg` : `${ngo.co2} kg offset` },
            { label: "People Impacted", value: isP2P ? "1 person" : "50+ families" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white border border-emerald-100 rounded-lg p-2.5 text-center shadow-xs">
              <p className="text-[10px] text-gray-500">{label}</p>
              <p className="text-xs font-bold text-gray-800">{value}</p>
            </div>
          ))}
        </div>
        {isP2P && (
          <div className="bg-white border border-cyan-200 text-amazon-teal text-xs font-semibold px-4 py-2 rounded-lg">
            📱 {p2p.recipient} has been notified. Item pickup will be arranged within 24 hours.
          </div>
        )}
        {!isP2P && (
          <div className="bg-white border border-emerald-200 text-emerald-800 text-xs font-semibold px-4 py-2 rounded-lg">
            📋 Tax exemption receipt will be generated by {ngo.org} within 48 hours.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* ── Section Title ── */}
      <div className="flex items-center gap-2">
        <div className="bg-gradient-to-br from-amazon-teal to-emerald-600 p-1.5 rounded-lg">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wide">
            Smart Donation Engine
          </h3>
          <p className="text-[10px] text-gray-500">AI-powered destination routing for your item</p>
        </div>
      </div>

      {/* ── Step 1: Destination Selection ── */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
        <p className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-amazon-teal" />
          What would you like to do with this item?
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <DestinationCard
            id="destination-resell"
            icon={Award}
            title="Resell"
            subtitle="List in certified used marketplace"
            selected={destination === "resell"}
            onClick={() => handleDestination("resell")}
            color="yellow"
          />
          <DestinationCard
            id="destination-refurbish"
            icon={Zap}
            title="Refurbish"
            subtitle="Route to refurbishment centre"
            selected={destination === "refurbish"}
            onClick={() => handleDestination("refurbish")}
            color="teal"
          />
          <DestinationCard
            id="destination-donate"
            icon={Heart}
            title="Donate"
            subtitle="Give to NGO or community"
            selected={destination === "donate"}
            onClick={() => handleDestination("donate")}
            color="green"
          />
        </div>

        {/* Resell / Refurbish confirmations */}
        {destination === "resell" && (
          <div className="mt-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 animate-fade-in">
            <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />
            Item will be restocked as a Certified Used listing. Verified buyers can purchase it from the marketplace.
          </div>
        )}
        {destination === "refurbish" && (
          <div className="mt-3 bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 animate-fade-in">
            <Zap className="w-4 h-4 text-amazon-teal flex-shrink-0" />
            Item is routed to a certified refurbishment partner for deep clean, repackaging, and functional testing.
          </div>
        )}
      </div>

      {/* ── Step 2: Donate sub-options ── */}
      {step === "donate-options" && destination === "donate" && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-700 mb-3">Choose donation type — or explore both to compare:</p>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* NGO option toggle */}
              <button
                id="select-ngo-donation"
                type="button"
                onClick={() => handleDonateType("ngo")}
                className={`flex-1 flex items-center gap-3 p-3.5 border-2 rounded-xl cursor-pointer transition-all text-left ${
                  donateType === "ngo" || donateType === "both"
                    ? "border-emerald-400 bg-emerald-50"
                    : "border-gray-200 bg-white hover:border-emerald-200"
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${donateType === "ngo" || donateType === "both" ? "bg-emerald-500" : "bg-gray-100"}`}>
                  <Building2 className={`w-5 h-5 ${donateType === "ngo" || donateType === "both" ? "text-white" : "text-gray-500"}`} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Donate to NGO</p>
                  <p className="text-[10px] text-gray-500">Amazon handles collection & delivery · +~50 Cr</p>
                </div>
              </button>

              {/* P2P option toggle */}
              <button
                id="select-p2p-donation"
                type="button"
                onClick={() => handleDonateType("p2p")}
                className={`flex-1 flex items-center gap-3 p-3.5 border-2 rounded-xl cursor-pointer transition-all text-left ${
                  donateType === "p2p" || donateType === "both"
                    ? "border-amazon-teal bg-cyan-50"
                    : "border-gray-200 bg-white hover:border-cyan-200"
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${donateType === "p2p" || donateType === "both" ? "bg-amazon-teal" : "bg-gray-100"}`}>
                  <Users className={`w-5 h-5 ${donateType === "p2p" || donateType === "both" ? "text-white" : "text-gray-500"}`} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Donate to Community</p>
                  <p className="text-[10px] text-gray-500">AI-matched local recipient · +~100 Cr</p>
                </div>
              </button>
            </div>

            {/* Hint to compare both */}
            {donateType && donateType !== "both" && (
              <p className="text-[10px] text-gray-500 mt-2.5 flex items-center gap-1 animate-fade-in">
                <ArrowRight className="w-3 h-3" />
                Click the other option to compare both side by side and get an AI recommendation.
              </p>
            )}
          </div>

          {/* NGO Card */}
          {(donateType === "ngo" || donateType === "both") && (
            <NGOCard ngo={ngo} gradeVal={gradeVal} />
          )}

          {/* P2P Card */}
          {(donateType === "p2p" || donateType === "both") && (
            <P2PCard p2p={p2p} gradeVal={gradeVal} />
          )}

          {/* Comparison + AI Recommendation */}
          {showComparison && (
            <AIComparisonPanel
              ngo={ngo}
              p2p={p2p}
              onSelectNGO={handleConfirmNGO}
              onSelectP2P={handleConfirmP2P}
              selectedFinal={selectedFinal}
            />
          )}

          {/* Single-type confirm buttons (only one selected) */}
          {donateType === "ngo" && !showComparison && (
            <button
              id="confirm-ngo-only"
              type="button"
              onClick={handleConfirmNGO}
              disabled={confirming}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-full transition-all shadow-sm cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              Confirm NGO Donation (+{ngo.credits.total} Cr)
            </button>
          )}
          {donateType === "p2p" && !showComparison && (
            <button
              id="confirm-p2p-only"
              type="button"
              onClick={handleConfirmP2P}
              disabled={confirming}
              className="w-full py-3 bg-amazon-teal hover:bg-cyan-700 text-white font-bold text-sm rounded-full transition-all shadow-sm cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              Confirm Community Donation (+{p2p.credits.total} Cr)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
