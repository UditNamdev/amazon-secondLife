import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircle2, ShieldCheck, MapPin, Zap, Globe, Leaf, Truck,
  Recycle, Users, Activity, FileText, Battery, HeartHandshake,
  Brain, Star, TrendingUp, BarChart2, Clock, Sparkles, Award
} from "lucide-react";

// ─── Animated counter hook ───────────────────────────────────────────────────
function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

// ─── Animated bar ────────────────────────────────────────────────────────────
function AnimatedBar({ value, color, delay = 0 }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), delay + 100);
    return () => clearTimeout(t);
  }, [value, delay]);
  return (
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

// ─── Progress Timeline ────────────────────────────────────────────────────────
export function ProgressTimeline({ status, created_at, completed_at }) {
  const flow = ["MATCHED", "ACCEPTED", "HANDOVER_PENDING", "VERIFIED", "CREDITS_RELEASED"];
  const currentIndex = flow.indexOf(status) === -1 ? flow.indexOf("CREDITS_RELEASED") : flow.indexOf(status);

  const labels = {
    MATCHED: "AI Match Found",
    ACCEPTED: "Recipient Accepted",
    HANDOVER_PENDING: "QR Generated",
    VERIFIED: "Item Received",
    CREDITS_RELEASED: "Credits Released",
  };

  const icons = {
    MATCHED: Brain,
    ACCEPTED: Users,
    HANDOVER_PENDING: ShieldCheck,
    VERIFIED: CheckCircle2,
    CREDITS_RELEASED: Award,
  };

  const getTimestamp = (step, idx) => {
    if (idx === 0 && created_at) {
      const d = new Date(created_at);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    if (step === "CREDITS_RELEASED" && completed_at) {
      return new Date(completed_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    if (idx < currentIndex) return "Completed";
    if (idx === currentIndex) return "In Progress";
    return "Pending";
  };

  return (
    <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white overflow-x-auto">
      <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-4">Donation Verification Journey</p>
      <div className="flex items-start justify-between min-w-[560px]">
        {flow.map((step, idx) => {
          const isCompleted = (currentIndex > idx) || (status === "CREDITS_RELEASED" && idx < flow.length);
          const isCurrent = currentIndex === idx && status !== "CREDITS_RELEASED";
          const Icon = icons[step];

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center gap-1.5 relative z-10 w-24 text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  isCompleted
                    ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-200"
                    : isCurrent
                    ? "bg-white border-amazon-teal text-amazon-teal shadow-[0_0_0_4px_rgba(0,113,133,0.15)] animate-pulse"
                    : "bg-gray-50 border-gray-200 text-gray-300"
                }`}>
                  {isCompleted
                    ? <CheckCircle2 className="w-4 h-4" />
                    : <Icon className="w-3.5 h-3.5" />
                  }
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-wide leading-tight text-center ${
                  isCompleted ? "text-emerald-700" : isCurrent ? "text-amazon-teal" : "text-gray-400"
                }`}>
                  {labels[step]}
                </span>
                <span className={`text-[8px] font-mono ${
                  isCurrent ? "text-amazon-teal font-bold" : "text-gray-400"
                }`}>
                  {getTimestamp(step, idx)}
                </span>
              </div>
              {idx < flow.length - 1 && (
                <div className="flex-1 mt-4 relative">
                  <div className="h-0.5 bg-gray-200 w-full" />
                  {isCompleted && (
                    <div
                      className="h-0.5 bg-emerald-400 absolute top-0 left-0 transition-all duration-1000"
                      style={{ width: "100%" }}
                    />
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// ─── AI Matching Engine Card ─────────────────────────────────────────────────
export function AIMatchingEngineCard({ candidates, selectedName, reason }) {
  if (!candidates || candidates.length === 0) return null;

  return (
    <div className="bg-white p-5 rounded-xl border border-indigo-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-2 mb-1">
        <div className="bg-indigo-600 p-1.5 rounded-lg">
          <Brain className="w-3.5 h-3.5 text-white" />
        </div>
        <h3 className="font-bold text-gray-900 text-sm">AI Recipient Matching</h3>
      </div>
      <p className="text-[10px] text-gray-500 mb-4 ml-8">
        Candidates Evaluated: <span className="font-bold text-indigo-600">{candidates.length}</span>
      </p>

      <div className="space-y-2.5 mb-4">
        {candidates.map((c, i) => {
          const isSelected = c.name === selectedName;
          return (
            <div
              key={i}
              className={`p-3 rounded-xl border transition-all ${
                isSelected
                  ? "bg-indigo-50 border-indigo-200 shadow-sm"
                  : "bg-gray-50 border-gray-100 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black ${
                    isSelected ? "bg-indigo-600 text-white" : "bg-gray-300 text-white"
                  }`}>
                    {i + 1}
                  </div>
                  <span className={`text-sm font-bold ${isSelected ? "text-indigo-900" : "text-gray-700"}`}>
                    {c.name}
                  </span>
                  {isSelected && (
                    <span className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.5 rounded-full font-bold">
                      Selected
                    </span>
                  )}
                </div>
                <span className={`text-sm font-black ${isSelected ? "text-indigo-700" : "text-gray-500"}`}>
                  {c.need}%
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px] text-gray-500">
                <div>
                  <p className="mb-1">Need Score</p>
                  <AnimatedBar value={c.need} color={isSelected ? "bg-indigo-500" : "bg-gray-300"} delay={i * 150} />
                </div>
                <div>
                  <p className="mb-1">Trust Score</p>
                  <AnimatedBar value={c.trust || 80} color={isSelected ? "bg-emerald-500" : "bg-gray-300"} delay={i * 150 + 50} />
                </div>
                <div>
                  <p className="mb-1">Category Match</p>
                  <AnimatedBar value={c.match} color={isSelected ? "bg-blue-500" : "bg-gray-300"} delay={i * 150 + 100} />
                </div>
              </div>
              <div className="flex gap-3 mt-2 text-[10px] text-gray-500">
                <span className="flex items-center gap-0.5">
                  <MapPin className="w-2.5 h-2.5" /> {c.dist} km
                </span>
                {c.trust && (
                  <span className="flex items-center gap-0.5">
                    <ShieldCheck className="w-2.5 h-2.5 text-emerald-500" /> Trust: {c.trust}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-indigo-50 border border-indigo-100 p-3.5 rounded-xl">
        <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider mb-1">
          Selection Reason
        </p>
        <p className="text-xs text-indigo-900 leading-relaxed">{reason}</p>
      </div>
    </div>
  );
}

// ─── AI Routing Decision Card ────────────────────────────────────────────────
export function AIRoutingDecisionCard({ decision }) {
  if (!decision) return null;

  const bars = [
    { label: "Donation Success", value: decision.donate, color: "bg-emerald-500", textColor: "text-emerald-700", winner: true },
    { label: "Resale Probability", value: decision.resale, color: "bg-amber-400", textColor: "text-amber-700" },
    { label: "Refurbishment Benefit", value: decision.refurb, color: "bg-blue-400", textColor: "text-blue-700" },
    { label: "Carbon Saving Potential", value: decision.carbon || 80, color: "bg-teal-500", textColor: "text-teal-700" },
  ];

  return (
    <div className="bg-white p-5 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-purple-600 p-1.5 rounded-lg">
          <Activity className="w-3.5 h-3.5 text-white" />
        </div>
        <h3 className="font-bold text-gray-900 text-sm">AI Routing Decision</h3>
      </div>

      <div className="space-y-3 mb-4">
        {bars.map((b, i) => (
          <div key={b.label}>
            <div className="flex justify-between items-center mb-1">
              <span className={`text-[11px] font-semibold ${b.winner ? "text-gray-900 font-bold" : "text-gray-600"}`}>
                {b.label}
              </span>
              <span className={`text-xs font-black ${b.textColor}`}>{b.value}%</span>
            </div>
            <AnimatedBar value={b.value} color={b.color} delay={i * 120} />
          </div>
        ))}
      </div>

      <div className="bg-purple-50 border border-purple-100 p-3.5 rounded-xl">
        <div className="flex items-center gap-1.5 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider">Decision: Community Donation</span>
        </div>
        <p className="text-xs text-purple-900 leading-relaxed">{decision.reason}</p>
      </div>
    </div>
  );
}

// ─── Product Passport Card ───────────────────────────────────────────────────
export function ProductPassportCard({ passport }) {
  if (!passport) return null;

  const score = parseInt(passport.score) || 90;
  const animatedScore = useCountUp(score, 1000);
  const circumference = 2 * Math.PI * 28;
  const strokeDash = (animatedScore / 100) * circumference;

  const details = [
    { label: "Grade", value: passport.grade, icon: Star, color: "text-amazon-teal" },
    { label: "Previous Owners", value: passport.owners, icon: Users, color: "text-gray-600" },
    { label: "Damage Detected", value: passport.damage, icon: ShieldCheck, color: passport.damage === "None" || passport.damage === "None detected" ? "text-emerald-600" : "text-amber-600" },
    { label: "Battery Health", value: passport.battery, icon: Battery, color: "text-blue-600" },
  ];

  return (
    <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <FileText className="w-3.5 h-3.5 text-white" />
        </div>
        <h3 className="font-bold text-gray-900 text-sm">AI Product Passport</h3>
      </div>

      <div className="flex items-center gap-5 mb-4">
        <div className="relative flex-shrink-0 w-16 h-16">
          <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
            <circle cx="32" cy="32" r="28" fill="none" stroke="#e5e7eb" strokeWidth="6" />
            <circle
              cx="32" cy="32" r="28"
              fill="none"
              stroke="#0071a1"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${strokeDash} ${circumference}`}
              style={{ transition: "stroke-dasharray 1s ease-out" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-black text-amazon-teal leading-none">{animatedScore}</span>
            <span className="text-[8px] text-gray-400 font-bold">/100</span>
          </div>
        </div>

        <div className="flex-1">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Condition Score</p>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-amazon-teal to-cyan-400 rounded-full transition-all duration-1000"
              style={{ width: `${score}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-400">
            Verification Confidence: <span className="font-bold text-emerald-600">{passport.confidence}</span>
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {details.map(({ label, value, icon: Icon, color }) => (
          value !== "N/A" && (
            <div key={label} className="flex items-center justify-between py-1.5 border-b border-gray-50">
              <span className="text-[11px] text-gray-500 flex items-center gap-1.5">
                <Icon className={`w-3 h-3 ${color}`} /> {label}
              </span>
              <span className="text-[11px] font-bold text-gray-800">{value}</span>
            </div>
          )
        ))}
      </div>

      <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 py-2 rounded-lg border border-emerald-100">
        <ShieldCheck className="w-3.5 h-3.5" /> Amazon AI Verified
      </div>
    </div>
  );
}

// ─── Green Credit Breakdown Card ─────────────────────────────────────────────
export function GreenCreditBreakdownCard({ credits }) {
  if (!credits) return null;

  const animatedTotal = useCountUp(credits.total, 1400);

  const rows = [
    { label: "Base Credits", value: credits.base, icon: "⚙️", color: "text-gray-700", barColor: "bg-gray-400" },
    { label: "Local Reuse Bonus", value: credits.local, icon: "🏘️", color: "text-blue-700", barColor: "bg-blue-500" },
    { label: "Carbon Reduction Bonus", value: credits.carbon, icon: "🌿", color: "text-emerald-700", barColor: "bg-emerald-500" },
    { label: "Fast Reuse Bonus", value: credits.fast, icon: "⚡", color: "text-amber-700", barColor: "bg-amber-400" },
  ];

  const maxVal = Math.max(...rows.map((r) => r.value));

  return (
    <div className="bg-white p-5 rounded-xl border border-emerald-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-emerald-600 p-1.5 rounded-lg">
          <Leaf className="w-3.5 h-3.5 text-white" />
        </div>
        <h3 className="font-bold text-gray-900 text-sm">Green Credit Breakdown</h3>
      </div>

      <div className="space-y-3 mb-4">
        {rows.map((r, i) => (
          <div key={r.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-gray-600">
                {r.icon} {r.label}
              </span>
              <span className={`text-[11px] font-black ${r.color}`}>+{r.value} Cr</span>
            </div>
            <AnimatedBar value={(r.value / (maxVal * 1.2)) * 100} color={r.barColor} delay={i * 100} />
          </div>
        ))}
      </div>

      <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex justify-between items-center">
        <div>
          <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">Total Earned</p>
          <p className="text-[10px] text-emerald-600 mt-0.5">Released on verified handover</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-emerald-700">{animatedTotal}</span>
          <span className="text-sm font-bold text-emerald-600"> Cr</span>
        </div>
      </div>
    </div>
  );
}

// ─── Impact Story Card ────────────────────────────────────────────────────────
export function ImpactStoryCard({ impact }) {
  if (!impact) return null;

  const stats = [
    { icon: "🌿", label: "Carbon Saved", value: impact.carbon },
    { icon: "🚚", label: "Logistics Saved", value: impact.logistics },
    { icon: "♻️", label: "Waste Prevented", value: impact.waste },
    { icon: "👨‍👩‍👧", label: "Community Impact", value: impact.families || "1 Family" },
  ];

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-xl border border-emerald-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
      <div className="absolute -right-6 -top-6 text-emerald-100 opacity-40 pointer-events-none">
        <Globe className="w-32 h-32" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-emerald-600 p-1.5 rounded-lg">
            <HeartHandshake className="w-3.5 h-3.5 text-white" />
          </div>
          <h3 className="font-bold text-emerald-900 text-sm">Impact Created</h3>
        </div>

        <p className="text-xs text-emerald-800 leading-relaxed mb-4 italic bg-white/50 p-3 rounded-lg border border-emerald-100">
          "{impact.story}"
        </p>

        <div className="grid grid-cols-2 gap-2">
          {stats.map(({ icon, label, value }) => (
            <div key={label} className="bg-white/70 p-2.5 rounded-lg border border-emerald-200/60 hover:-translate-y-0.5 transition-transform">
              <p className="text-base mb-0.5">{icon}</p>
              <p className="text-[9px] font-bold uppercase text-emerald-700 tracking-wider">{label}</p>
              <p className="text-xs font-black text-emerald-900">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── AI Recommendation Panel (legacy compat) ─────────────────────────────────
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
            <p className="text-[10px] font-bold text-gray-500 uppercase">Carbon Saving</p>
            <p className="text-sm font-black text-emerald-600">{carbonSaving || "82%"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sustainability Impact Panel ─────────────────────────────────────────────
export function SustainabilityImpactPanel({ carbon, logistics, waste, people }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { icon: Leaf, label: "Carbon Saved", value: carbon, bg: "bg-emerald-50", border: "border-emerald-100", color: "text-emerald-600", textColor: "text-emerald-800" },
        { icon: Truck, label: "Logistics Saved", value: logistics, bg: "bg-amber-50", border: "border-amber-100", color: "text-amber-600", textColor: "text-amber-800" },
        { icon: Recycle, label: "Waste Diverted", value: waste, bg: "bg-blue-50", border: "border-blue-100", color: "text-blue-600", textColor: "text-blue-800" },
        { icon: Users, label: "People Helped", value: people, bg: "bg-purple-50", border: "border-purple-100", color: "text-purple-600", textColor: "text-purple-800" },
      ].map(({ icon: Icon, label, value, bg, border, color, textColor }) => (
        <div key={label} className={`${bg} p-3 rounded-xl border ${border} text-center hover:-translate-y-1 transition-transform`}>
          <Icon className={`w-6 h-6 ${color} mx-auto mb-1`} />
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{label}</p>
          <p className={`text-lg font-black ${textColor}`}>{value}</p>
        </div>
      ))}
    </div>
  );
}
