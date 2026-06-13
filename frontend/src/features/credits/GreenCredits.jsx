// frontend/src/features/credits/GreenCredits.jsx
import React from "react";
import { Leaf, Gift, CheckCircle, ArrowRight, ShieldCheck, Heart } from "lucide-react";

export default function GreenCredits() {
  const earningsList = [
    {
      action: "Grade a returned item",
      desc: "Prevent scrap waste by routing returns to resale or refurbish channels.",
      credits: "+100 - +150 Cr"
    },
    {
      action: "Donate an acceptable return",
      desc: "Donate low-resale return items to NGO social impact directories.",
      credits: "+300 Cr"
    },
    {
      action: "Buy certified used items",
      desc: "Purchase open-box return listings instead of brand new items.",
      credits: "+50 Cr"
    },
    {
      action: "Recycle damaged returns",
      desc: "Verify raw material scrap extraction for circular loop recovery.",
      credits: "+450 Cr"
    }
  ];

  const rewards = [
    {
      title: "$5 Amazon Gift Voucher",
      cost: "500 Credits",
      desc: "Applicable on any purchase in the Amazon store."
    },
    {
      title: "Carbon Offset Certificate",
      cost: "300 Credits",
      desc: "Offset 100kg of CO2 equivalent emissions."
    },
    {
      title: "Free Refurbish Package Upgrade",
      cost: "200 Credits",
      desc: "Premium box packaging on your next certified used purchase."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 font-sans">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-950 text-white p-6 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 select-none">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-1.5">
            <Leaf className="w-6 h-6 text-emerald-400 fill-current" /> Green Credits Hub
          </h1>
          <p className="text-xs text-emerald-150 leading-relaxed max-w-md">
            Amazon's circular returns ledger. Earn credits for recycling, refurbishing, and buying certified used items.
          </p>
        </div>

        {/* Balance card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 rounded-lg flex items-center gap-4 flex-shrink-0">
          <div className="bg-emerald-500 rounded-full p-2">
            <Leaf className="w-6 h-6 text-white fill-current" />
          </div>
          <div>
            <span className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider block">Your Balance</span>
            <span className="text-3xl font-black text-white leading-none block">450 <span className="text-lg font-bold">Cr</span></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left column: How to earn */}
        <div className="bg-white border border-[#D5D9D9] rounded-md p-6 space-y-4">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-1.5">
            <CheckCircle className="w-5 h-5 text-amazon-green" /> How to Earn Credits
          </h2>

          <div className="space-y-4">
            {earningsList.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-gray-900">{item.action}</h4>
                  <p className="text-[11px] text-gray-500 leading-tight">{item.desc}</p>
                </div>
                <span className="text-xs font-extrabold text-amazon-green whitespace-nowrap bg-emerald-50 px-2 py-0.5 border border-emerald-100 rounded">
                  {item.credits}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Rewards */}
        <div className="bg-white border border-[#D5D9D9] rounded-md p-6 space-y-4">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-1.5">
            <Gift className="w-5 h-5 text-amazon-teal" /> Redeem Eco Rewards
          </h2>

          <div className="space-y-4">
            {rewards.map((reward, idx) => (
              <div key={idx} className="flex justify-between items-center gap-4 p-3 border border-gray-200 rounded-lg hover:border-amazon-teal">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-gray-900">{reward.title}</h4>
                  <p className="text-[11px] text-gray-500 leading-tight">{reward.desc}</p>
                  <span className="text-[10px] text-amazon-teal font-semibold block mt-1">{reward.cost} required</span>
                </div>
                <button className="px-3 py-1 bg-amazon-yellow hover:bg-amazon-yellowHover text-gray-900 border border-yellow-400 rounded-full text-[10px] font-bold shadow-xs whitespace-nowrap cursor-pointer">
                  Redeem
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Sustainability pledge footer card */}
      <div className="bg-white border border-[#D5D9D9] rounded-md p-6 mt-6 flex flex-col sm:flex-row items-center gap-4 select-none">
        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-amazon-green flex-shrink-0">
          <Heart className="w-6 h-6 fill-current" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">circular return verification pledge</h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            By verifying open-box returned item condition with Gemini Computer Vision, SecondLife bypasses standard liquidation shipping and routes items locally, lowering carbon footprints by over 80%.
          </p>
        </div>
      </div>
      
    </div>
  );
}
