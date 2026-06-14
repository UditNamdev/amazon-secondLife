import React from "react";
import { CheckCircle2, ShieldCheck, MapPin, Zap, Globe, Leaf, Truck, Recycle, Users, Activity, FileText, Battery, HeartHandshake } from "lucide-react";

export function ProgressTimeline({ status, created_at, completed_at }) {
  const flow = ["MATCHED", "ACCEPTED", "HANDOVER_PENDING", "VERIFIED", "CREDITS_RELEASED"];
  const currentIndex = flow.indexOf(status) === -1 ? flow.indexOf("CREDITS_RELEASED") : flow.indexOf(status);

  const labels = {
    "MATCHED": "AI Match Found",
    "ACCEPTED": "Recipient Accepted",
    "HANDOVER_PENDING": "QR Generated",
    "VERIFIED": "Recipient Verified",
    "CREDITS_RELEASED": "Credits Released"
  };

  const getTimestamp = (step, idx) => {
    if (idx === 0) return created_at ? new Date(created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Just now";
    if (step === "CREDITS_RELEASED" && completed_at) return new Date(completed_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    if (idx < currentIndex) return "Done";
    if (idx === currentIndex) return "Pending";
    return "";
  };

  return (
    <div className="px-6 py-4 border-b border-gray-100 bg-white overflow-x-auto">
      <div className="flex items-start justify-between min-w-[500px]">
        {flow.map((step, idx) => {
          const isCompleted = currentIndex > idx || status === "CREDITS_RELEASED";
          const isCurrent = currentIndex === idx && status !== "CREDITS_RELEASED";

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center gap-1.5 relative z-10 w-24 text-center group">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  isCompleted ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-200" :
                  isCurrent ? "bg-white border-amazon-teal text-amazon-teal shadow-[0_0_0_4px_rgba(0,113,133,0.15)] animate-pulse" :
                  "bg-gray-50 border-gray-300 text-gray-300"
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span className="text-[10px] font-bold">{idx + 1}</span>}
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-wider mt-1 ${
                  isCompleted ? "text-emerald-700" : isCurrent ? "text-amazon-teal" : "text-gray-400"
                }`}>
                  {labels[step]}
                </span>
                <span className="text-[8px] text-gray-400 font-mono mt-0.5">
                  {getTimestamp(step, idx)}
                </span>
              </div>
              {idx < flow.length - 1 && (
                <div className={`flex-1 h-0.5 mt-3 transition-all duration-1000 ${
                  isCompleted ? "bg-emerald-400" : "bg-gray-200"
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export function AIRecommendationPanel({ distance, reason, carbonSaving }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-4 mt-4 hover:shadow-md transition-shadow">
      <div className="text-4xl">🤖</div>
      <div>
        <h4 className="text-sm font-bold text-blue-900">AI Recommendation</h4>
        <p className="text-xs text-blue-800 mt-1">{reason}</p>
        <div className="flex flex-wrap gap-4 mt-3">
          <div className="bg-white/60 px-3 py-1.5 rounded-md border border-blue-100">
            <p className="text-[10px] font-bold text-gray-500 uppercase">Distance</p>
            <p className="text-sm font-black text-blue-900">{distance} km</p>
          </div>
          <div className="bg-white/60 px-3 py-1.5 rounded-md border border-blue-100">
            <p className="text-[10px] font-bold text-gray-500 uppercase">Reuse Prob</p>
            <p className="text-sm font-black text-blue-900">95%</p>
          </div>
          <div className="bg-white/60 px-3 py-1.5 rounded-md border border-blue-100">
            <p className="text-[10px] font-bold text-gray-500 uppercase">Carbon Saving</p>
            <p className="text-sm font-black text-emerald-600">{carbonSaving || "82%"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AIMatchingEngineCard({ candidates, selectedName, reason }) {
  if (!candidates) return null;
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
      <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-indigo-500" /> AI Recipient Matching
      </h3>
      <p className="text-xs text-gray-500 mb-4">Candidates Evaluated: {candidates.length}</p>
      
      <div className="space-y-3 mb-5">
        {candidates.map((c, i) => (
          <div key={i} className={`p-3 rounded-lg border flex justify-between items-center ${c.name === selectedName ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-gray-50 border-gray-100 opacity-70'}`}>
            <div>
               <p className={`text-sm font-bold ${c.name === selectedName ? 'text-indigo-900' : 'text-gray-700'}`}>{c.name} {c.name === selectedName && "✓"}</p>
               <p className="text-[10px] text-gray-500 mt-0.5">Dist: {c.dist}km • Match: {c.match}%</p>
            </div>
            <div className="text-right">
               <p className="text-[10px] font-bold text-gray-500 uppercase">Need Score</p>
               <p className={`text-sm font-black ${c.name === selectedName ? 'text-indigo-600' : 'text-gray-500'}`}>{c.need}%</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-lg text-xs text-indigo-900">
         <strong>Selected: {selectedName}</strong>
         <p className="mt-1 opacity-90">{reason}</p>
      </div>
    </div>
  );
}

export function AIRoutingDecisionCard({ decision }) {
  if (!decision) return null;
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
      <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-purple-500" /> AI Routing Decision
      </h3>
      
      <div className="grid grid-cols-2 gap-3 mb-5">
         <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg text-center">
            <p className="text-[10px] font-bold uppercase text-gray-500">Resale Prob</p>
            <p className="text-lg font-black text-amber-600">{decision.resale}%</p>
         </div>
         <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-center shadow-sm">
            <p className="text-[10px] font-bold uppercase text-emerald-800">Donation Success</p>
            <p className="text-lg font-black text-emerald-600">{decision.donate}%</p>
         </div>
      </div>
      
      <div className="bg-purple-50 border border-purple-100 p-4 rounded-lg text-xs text-purple-900">
         <strong>Decision: Community Donation</strong>
         <p className="mt-1 opacity-90">{decision.reason}</p>
      </div>
    </div>
  );
}

export function ProductPassportCard({ passport }) {
  if (!passport) return null;
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
      <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-blue-500" /> AI Product Passport
      </h3>
      
      <div className="flex gap-4 mb-4">
         <div className="flex-1 bg-amazon-teal/5 border border-amazon-teal/20 p-3 rounded-lg text-center">
            <p className="text-[10px] font-bold uppercase text-gray-500">Condition</p>
            <p className="text-xl font-black text-amazon-teal">{passport.score}</p>
         </div>
         <div className="flex-1 bg-amazon-teal/5 border border-amazon-teal/20 p-3 rounded-lg text-center">
            <p className="text-[10px] font-bold uppercase text-gray-500">Grade</p>
            <p className="text-lg font-black text-amazon-teal mt-0.5">{passport.grade}</p>
         </div>
      </div>
      
      <ul className="space-y-2 text-xs">
         <li className="flex justify-between border-b border-gray-50 pb-1">
            <span className="text-gray-500">Previous Owners</span>
            <span className="font-mono">{passport.owners}</span>
         </li>
         <li className="flex justify-between border-b border-gray-50 pb-1">
            <span className="text-gray-500">Damage Detected</span>
            <span className="font-mono">{passport.damage}</span>
         </li>
         <li className="flex justify-between border-b border-gray-50 pb-1">
            <span className="text-gray-500">Battery Health</span>
            <span className="font-mono flex items-center gap-1"><Battery className="w-3 h-3 text-emerald-500"/>{passport.battery}</span>
         </li>
      </ul>
      
      <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 py-2 rounded-md">
         <ShieldCheck className="w-3.5 h-3.5" /> Verification Confidence: {passport.confidence}
      </div>
    </div>
  );
}

export function GreenCreditBreakdownCard({ credits }) {
  if (!credits) return null;
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
      <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
        <Leaf className="w-5 h-5 text-emerald-500" /> Green Credit Breakdown
      </h3>
      
      <div className="space-y-2 mb-4 text-xs">
         <div className="flex justify-between items-center p-2 rounded hover:bg-gray-50">
            <span className="text-gray-600">Base Credits</span>
            <span className="font-mono font-bold">{credits.base}</span>
         </div>
         <div className="flex justify-between items-center p-2 rounded hover:bg-gray-50">
            <span className="text-gray-600">Local Reuse Bonus</span>
            <span className="font-mono font-bold text-emerald-600">+{credits.local}</span>
         </div>
         <div className="flex justify-between items-center p-2 rounded hover:bg-gray-50">
            <span className="text-gray-600">Carbon Reduction Bonus</span>
            <span className="font-mono font-bold text-emerald-600">+{credits.carbon}</span>
         </div>
         <div className="flex justify-between items-center p-2 rounded hover:bg-gray-50">
            <span className="text-gray-600">Fast Reuse Bonus</span>
            <span className="font-mono font-bold text-emerald-600">+{credits.fast}</span>
         </div>
      </div>
      
      <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex justify-between items-center">
         <span className="text-sm font-bold text-emerald-900">Total Credits</span>
         <span className="text-xl font-black text-emerald-700">{credits.total} Cr</span>
      </div>
    </div>
  );
}

export function ImpactStoryCard({ impact }) {
  if (!impact) return null;
  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
      <div className="absolute -right-4 -top-4 text-emerald-100 opacity-50">
         <Globe className="w-32 h-32" />
      </div>
      <div className="relative z-10">
         <h3 className="font-bold text-emerald-900 flex items-center gap-2 mb-3">
            <HeartHandshake className="w-5 h-5 text-emerald-600" /> Impact Created
         </h3>
         <p className="text-sm text-emerald-800 leading-relaxed mb-5 italic">
            "{impact.story}"
         </p>
         
         <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/60 p-2.5 rounded-lg border border-emerald-200/50">
               <p className="text-[9px] font-bold uppercase text-emerald-700 tracking-wider">Carbon Saved</p>
               <p className="text-sm font-black text-emerald-900">{impact.carbon}</p>
            </div>
            <div className="bg-white/60 p-2.5 rounded-lg border border-emerald-200/50">
               <p className="text-[9px] font-bold uppercase text-emerald-700 tracking-wider">Logistics Saved</p>
               <p className="text-sm font-black text-emerald-900">{impact.logistics}</p>
            </div>
            <div className="bg-white/60 p-2.5 rounded-lg border border-emerald-200/50">
               <p className="text-[9px] font-bold uppercase text-emerald-700 tracking-wider">Waste Prevented</p>
               <p className="text-sm font-black text-emerald-900">{impact.waste}</p>
            </div>
            <div className="bg-white/60 p-2.5 rounded-lg border border-emerald-200/50">
               <p className="text-[9px] font-bold uppercase text-emerald-700 tracking-wider">Community Impact</p>
               <p className="text-sm font-black text-emerald-900">1 Recipient</p>
            </div>
         </div>
      </div>
    </div>
  );
}

export function SustainabilityImpactPanel({ carbon, logistics, waste, people }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-center hover:-translate-y-1 transition-transform">
        <Leaf className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Carbon Saved</p>
        <p className="text-lg font-black text-emerald-800">{carbon}</p>
      </div>
      <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 text-center hover:-translate-y-1 transition-transform">
        <Truck className="w-6 h-6 text-amber-600 mx-auto mb-1" />
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Logistics Saved</p>
        <p className="text-lg font-black text-amber-800">{logistics}</p>
      </div>
      <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-center hover:-translate-y-1 transition-transform">
        <Recycle className="w-6 h-6 text-blue-600 mx-auto mb-1" />
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Waste Diverted</p>
        <p className="text-lg font-black text-blue-800">{waste}</p>
      </div>
      <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 text-center hover:-translate-y-1 transition-transform">
        <Users className="w-6 h-6 text-purple-600 mx-auto mb-1" />
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">People Helped</p>
        <p className="text-lg font-black text-purple-800">{people}</p>
      </div>
    </div>
  );
}
