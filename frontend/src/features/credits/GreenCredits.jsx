// frontend/src/features/credits/GreenCredits.jsx
import React from "react";
import { Leaf, Gift, CheckCircle, Heart, Building2, Users, Zap, BarChart3, Globe, Recycle, HandHeart, TrendingDown } from "lucide-react";

export default function GreenCredits() {
  const earningsList = [
    {
      icon: CheckCircle,
      action: "Grade a returned item",
      desc: "Prevent scrap waste by routing returns to resale or refurbish channels.",
      credits: "+100–150 Cr",
      color: "text-amazon-teal",
      bg: "bg-cyan-50 border-cyan-100",
    },
    {
      icon: Recycle,
      action: "Recycle damaged returns",
      desc: "Verify raw material scrap extraction for circular loop recovery.",
      credits: "+450 Cr",
      color: "text-rose-600",
      bg: "bg-rose-50 border-rose-100",
    },
    {
      icon: Building2,
      action: "Donate via NGO",
      desc: "Amazon collects & delivers to verified NGO partner — high social impact.",
      credits: "+50 Cr",
      color: "text-emerald-700",
      bg: "bg-emerald-50 border-emerald-100",
      isNew: true,
    },
    {
      icon: Users,
      action: "Donate via Community (P2P)",
      desc: "AI-matched local recipient — lower emissions, faster reuse, higher reward.",
      credits: "+100 Cr",
      color: "text-amazon-teal",
      bg: "bg-teal-50 border-teal-100",
      isNew: true,
    },
    {
      icon: Zap,
      action: "High Sustainability Match",
      desc: "AI finds a <2 km match with >90% reuse probability — bonus credits awarded.",
      credits: "+Bonus Cr",
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-100",
      isNew: true,
    },
    {
      icon: Gift,
      action: "Buy certified used items",
      desc: "Purchase open-box return listings instead of brand new items.",
      credits: "+50 Cr",
      color: "text-purple-600",
      bg: "bg-purple-50 border-purple-100",
    },
  ];

  const rewards = [
    {
      title: "₹500 Amazon Gift Voucher",
      cost: "500 Credits",
      desc: "Applicable on any purchase in the Amazon store.",
    },
    {
      title: "Carbon Offset Certificate",
      cost: "300 Credits",
      desc: "Offset 100 kg of CO₂ equivalent emissions.",
    },
    {
      title: "Free Refurbish Package Upgrade",
      cost: "200 Credits",
      desc: "Premium box packaging on your next certified used purchase.",
    },
    {
      title: "Priority NGO Tax Receipt",
      cost: "150 Credits",
      desc: "Expedited tax-exemption receipt from NGO partner within 24 hrs.",
    },
  ];

  const donationStats = [
    { icon: HandHeart, label: "Products Donated", value: "1,284", sub: "This month", color: "text-rose-500", bg: "bg-rose-50 border-rose-100" },
    { icon: Recycle, label: "Products Reused", value: "3,670", sub: "Via P2P & NGO", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
    { icon: Globe, label: "Carbon Saved", value: "4.2 t", sub: "CO₂ equivalent", color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
    { icon: Users, label: "People Helped", value: "9,120+", sub: "Beneficiaries", color: "text-amazon-teal", bg: "bg-cyan-50 border-cyan-100" },
  ];

  const dashboardMetrics = [
    { icon: Globe, label: "Carbon Emissions Saved", value: "18.6 t CO₂", trend: "↑ 22% vs last month", positive: true },
    { icon: TrendingDown, label: "Logistics Cost Saved", value: "₹3,42,000", trend: "↑ 18% via P2P routing", positive: true },
    { icon: Recycle, label: "Landfill Waste Prevented", value: "2,190 kg", trend: "↑ 35% recycled correctly", positive: true },
    { icon: Zap, label: "Community Impact Score", value: "94 / 100", trend: "Top 5% of platforms", positive: true },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 font-sans space-y-6">

      {/* ── Page Header ── */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-950 text-white p-6 rounded-xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 select-none">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Leaf className="w-6 h-6 text-emerald-400 fill-current" />
            Green Credits Hub
          </h1>
          <p className="text-xs text-emerald-200 leading-relaxed max-w-md">
            Amazon's circular returns ledger. Earn credits for recycling, refurbishing, donating, and buying certified used items.
          </p>
        </div>

        {/* Balance card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 rounded-xl flex items-center gap-4 flex-shrink-0">
          <div className="bg-emerald-500 rounded-full p-2">
            <Leaf className="w-6 h-6 text-white fill-current" />
          </div>
          <div>
            <span className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider block">Your Balance</span>
            <span className="text-3xl font-black text-white leading-none block">
              450 <span className="text-lg font-bold">Cr</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Dashboard Sustainability Metrics ── */}
      <div>
        <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-amazon-teal" />
          Platform Sustainability Metrics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {dashboardMetrics.map((m) => (
            <div key={m.label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs hover:shadow-sm transition-shadow">
              <m.icon className="w-5 h-5 text-amazon-teal mb-2" />
              <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">{m.label}</p>
              <p className="text-lg font-black text-gray-900 mt-0.5 leading-tight">{m.value}</p>
              <p className={`text-[10px] mt-1 font-semibold ${m.positive ? "text-emerald-600" : "text-rose-500"}`}>{m.trend}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Donation Statistics ── */}
      <div>
        <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
          <HandHeart className="w-4 h-4 text-rose-500" />
          Smart Donation Engine — Impact Stats
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {donationStats.map((s) => (
            <div key={s.label} className={`border rounded-xl p-4 flex flex-col items-center text-center shadow-xs ${s.bg}`}>
              <s.icon className={`w-6 h-6 mb-2 ${s.color}`} />
              <p className="text-xl font-black text-gray-900">{s.value}</p>
              <p className="text-[11px] font-bold text-gray-700 mt-0.5">{s.label}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── How to Earn + Rewards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Left: How to Earn */}
        <div className="bg-white border border-[#D5D9D9] rounded-xl p-6 space-y-3 shadow-xs">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-1.5">
            <CheckCircle className="w-5 h-5 text-amazon-green" /> How to Earn Credits
          </h2>
          <div className="space-y-2.5">
            {earningsList.map((item, idx) => (
              <div
                key={idx}
                className={`flex justify-between items-start gap-3 p-3 rounded-xl border transition-colors hover:brightness-95 ${item.bg}`}
              >
                <div className="flex items-start gap-2.5 flex-1">
                  <item.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${item.color}`} />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-gray-900">{item.action}</h4>
                      {item.isNew && (
                        <span className="text-[8px] bg-amazon-teal text-white font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">New</span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 leading-tight">{item.desc}</p>
                  </div>
                </div>
                <span className={`text-xs font-extrabold whitespace-nowrap px-2 py-0.5 rounded-lg bg-white border shadow-xs ${item.color}`}>
                  {item.credits}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Rewards */}
        <div className="bg-white border border-[#D5D9D9] rounded-xl p-6 space-y-3 shadow-xs">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-1.5">
            <Gift className="w-5 h-5 text-amazon-teal" /> Redeem Eco Rewards
          </h2>
          <div className="space-y-3">
            {rewards.map((reward, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center gap-4 p-3.5 border border-gray-200 rounded-xl hover:border-amazon-teal hover:bg-cyan-50/30 transition-all"
              >
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-gray-900">{reward.title}</h4>
                  <p className="text-[10px] text-gray-500 leading-tight">{reward.desc}</p>
                  <span className="text-[10px] text-amazon-teal font-semibold block mt-1">{reward.cost} required</span>
                </div>
                <button className="px-3 py-1.5 bg-amazon-yellow hover:bg-amazon-yellowHover text-gray-900 border border-yellow-400 rounded-full text-[10px] font-bold shadow-xs whitespace-nowrap cursor-pointer transition-colors">
                  Redeem
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── NGO vs P2P comparison callout ── */}
      <div className="bg-white border border-[#D5D9D9] rounded-xl p-6 shadow-xs">
        <h2 className="text-sm font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amazon-teal" />
          NGO vs Community Donation — Credit Comparison
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* NGO */}
          <div className="border-2 border-emerald-200 bg-emerald-50 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-700" />
              <span className="text-sm font-extrabold text-emerald-800">NGO Donation</span>
            </div>
            <p className="text-[11px] text-gray-600">Amazon handles collection &amp; delivery to verified partner NGO. Higher logistics cost reduces credits slightly.</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {["Base: +30 Cr", "Grade Bonus: +5–15 Cr", "Sustainability: +10 Cr", "Logistics: −5 Cr"].map(t => (
                <span key={t} className="text-[10px] bg-white border border-emerald-200 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">{t}</span>
              ))}
            </div>
            <div className="text-lg font-black text-emerald-700 mt-1">≈ 50 Cr total</div>
          </div>

          {/* P2P */}
          <div className="border-2 border-cyan-200 bg-cyan-50 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amazon-teal" />
              <span className="text-sm font-extrabold text-amazon-teal">Community P2P Donation</span>
              <span className="text-[9px] bg-amazon-teal text-white font-bold px-1.5 py-0.5 rounded-full">Higher Reward</span>
            </div>
            <p className="text-[11px] text-gray-600">AI matches item to a local recipient. Shorter distance = less CO₂, more credits. Reuse happens immediately.</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {["Base: +60 Cr", "Grade Bonus: +5–15 Cr", "Local Reuse: +~22 Cr", "Sustainability: +20 Cr", "Logistics: −2 Cr"].map(t => (
                <span key={t} className="text-[10px] bg-white border border-cyan-200 text-amazon-teal font-semibold px-2 py-0.5 rounded-full">{t}</span>
              ))}
            </div>
            <div className="text-lg font-black text-amazon-teal mt-1">≈ 100 Cr total</div>
          </div>
        </div>
      </div>

      {/* ── Sustainability pledge footer ── */}
      <div className="bg-white border border-[#D5D9D9] rounded-xl p-6 flex flex-col sm:flex-row items-center gap-4 select-none shadow-xs">
        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-amazon-green flex-shrink-0">
          <Heart className="w-6 h-6 fill-current" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">Circular Return Verification Pledge</h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            By verifying open-box returned item condition with Gemini Computer Vision, SecondLife bypasses standard liquidation shipping and routes items locally via the Smart Donation Engine — lowering carbon footprints by over 80%.
          </p>
        </div>
      </div>

    </div>
  );
}
