import React from "react";
import {
  Lock, Unlock, MapPin, Users, Package, ShieldCheck, Gift,
  Brain, Sparkles, ChevronRight
} from "lucide-react";
import { updateDonation } from "../../../services/donationStore";
import { DonationQRDisplay } from "../DonationQR";
import {
  ProgressTimeline,
  AIMatchingEngineCard,
  AIRoutingDecisionCard,
  ProductPassportCard,
  GreenCreditBreakdownCard,
  ImpactStoryCard,
} from "./SharedComponents";

export default function DonorDashboard({ donation, onUpdate }) {
  const ctx = donation.ai_context || {};

  const handleDonorConfirm = () => {
    updateDonation(donation.id, { donor_confirmed: true });
    onUpdate();
  };

  const handleStatusChange = (newStatus) => {
    updateDonation(donation.id, { status: newStatus });
    onUpdate();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6 animate-fade-in">

      {/* ── Header ── */}
      <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] bg-amazon-teal text-white font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              {donation.category}
            </span>
            <span className="text-[10px] text-gray-400 font-mono">#{donation.id.split("_")[2]?.toUpperCase()}</span>
          </div>
          <h3 className="text-lg font-extrabold text-gray-900">{donation.productName}</h3>
          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1.5">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> Recipient: <strong className="text-gray-800 ml-1">{donation.recipient_name}</strong>
            </span>
            <span className="flex items-center gap-1 text-amazon-teal font-semibold">
              <MapPin className="w-3.5 h-3.5" /> {donation.distance} km away
            </span>
          </div>
        </div>

        <div className={`px-4 py-2.5 rounded-xl border flex items-center gap-3 flex-shrink-0 transition-all ${
          donation.credits_status === "released"
            ? "bg-emerald-50 border-emerald-200 shadow-sm"
            : "bg-amber-50 border-amber-200"
        }`}>
          {donation.credits_status === "released"
            ? <Unlock className="w-5 h-5 text-emerald-600" />
            : <Lock className="w-5 h-5 text-amber-500" />
          }
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Green Credits</p>
            <p className={`text-base font-black ${donation.credits_status === "released" ? "text-emerald-700" : "text-amber-700"}`}>
              {donation.green_credits} Cr
            </p>
            <p className={`text-[9px] font-semibold ${donation.credits_status === "released" ? "text-emerald-600" : "text-amber-600"}`}>
              {donation.credits_status === "released" ? "Released" : "In Escrow"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Timeline ── */}
      <ProgressTimeline
        status={donation.status}
        created_at={donation.created_at}
        completed_at={donation.completed_at}
      />

      {/* ── Main Body ── */}
      <div className="p-6 space-y-8">

        {/* ── Action Panel ── */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Your Action Required</h4>

          {donation.status === "MATCHED" && (
            <div className="text-center p-6 border border-indigo-100 rounded-xl bg-indigo-50">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Brain className="w-5 h-5 text-indigo-600 animate-pulse" />
              </div>
              <p className="text-sm font-bold text-gray-900 mb-1">AI Match Found — Awaiting Acceptance</p>
              <p className="text-xs text-gray-500">
                {donation.recipient_name} has been notified and will accept the donation shortly.
              </p>
              <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-indigo-600 font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
                </span>
                Waiting for recipient response...
              </div>
            </div>
          )}

          {donation.status === "ACCEPTED" && (
            <div className="p-6 border border-amber-200 rounded-xl bg-amber-50">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-amber-900 mb-1">Donation Accepted by {donation.recipient_name}!</p>
                  <p className="text-xs text-amber-700 mb-4">
                    Please prepare the item for physical handover. Generate a QR code so the recipient can verify receipt.
                  </p>
                  <button
                    onClick={() => handleStatusChange("HANDOVER_PENDING")}
                    className="flex items-center gap-2 px-5 py-2.5 bg-amazon-yellow text-gray-900 text-xs font-bold rounded-full border border-yellow-400 hover:bg-yellow-400 hover:scale-105 transition-all shadow-sm"
                  >
                    Generate Verification QR <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {donation.status === "HANDOVER_PENDING" && (
            <div className="p-5 rounded-xl border border-amazon-teal bg-cyan-50/30">
              <h4 className="text-sm font-bold text-gray-800 mb-1">Physical Handover</h4>
              <p className="text-xs text-gray-500 mb-5">
                Show this QR code to {donation.recipient_name} when you meet. They scan it to verify receipt.
              </p>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0 flex justify-center bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                  <DonationQRDisplay verificationCode={donation.verification_code} />
                </div>
                <div className="flex-1 flex flex-col justify-between h-full gap-4">
                  <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-2.5 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Item</span>
                      <strong className="text-gray-900">{donation.productName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Recipient</span>
                      <strong className="text-gray-900">{donation.recipient_name}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Distance</span>
                      <strong className="text-amazon-teal">{donation.distance} km</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Credits on release</span>
                      <strong className="text-emerald-700">+{donation.green_credits} Cr</strong>
                    </div>
                  </div>
                  <button
                    onClick={handleDonorConfirm}
                    disabled={donation.donor_confirmed}
                    className={`w-full py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${
                      donation.donor_confirmed
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        : "bg-amazon-teal text-white hover:bg-cyan-700 hover:-translate-y-0.5 active:scale-95"
                    }`}
                  >
                    {donation.donor_confirmed ? "✓ Item Marked as Delivered" : "Mark Item as Delivered"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {(donation.status === "VERIFIED" || donation.status === "CREDITS_RELEASED") && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center shadow-sm">
              <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Gift className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-emerald-900">Handover Complete!</h3>
              <p className="text-sm text-emerald-700 mt-1 mb-3">
                {donation.recipient_name} has confirmed receipt. Your Green Credits have been released.
              </p>
              <div className="inline-flex items-center gap-2 bg-emerald-700 text-white px-5 py-2 rounded-full font-black text-sm shadow">
                🌿 +{donation.green_credits} Credits Released
              </div>
            </div>
          )}
        </div>

        {/* ── AI Intelligence Cards — 3-column grid ── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-amazon-teal" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">AI Decision Intelligence</h4>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <AIMatchingEngineCard
              candidates={ctx.candidates}
              selectedName={donation.recipient_name}
              reason={ctx.matching_reason}
            />
            <AIRoutingDecisionCard decision={ctx.routing_decision} />
            <ProductPassportCard passport={ctx.passport} />
          </div>
        </div>

        {/* ── Green Credits + Impact Story ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <GreenCreditBreakdownCard credits={ctx.credits} />
          <ImpactStoryCard impact={ctx.impact} />
        </div>

      </div>
    </div>
  );
}
