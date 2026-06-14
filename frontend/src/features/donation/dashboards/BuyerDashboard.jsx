import React, { useState } from "react";
import {
  CheckCircle2, ShieldCheck, Camera, ImageIcon, Gift, MapPin,
  Brain, Star, Sparkles
} from "lucide-react";
import { updateDonation } from "../../../services/donationStore";
import { DonationQRScanner } from "../DonationQR";
import {
  ProgressTimeline,
  ProductPassportCard,
  AIRoutingDecisionCard,
  ImpactStoryCard,
} from "./SharedComponents";

export default function BuyerDashboard({ donation, onUpdate }) {
  const [uploadingProof, setUploadingProof] = useState(false);
  const ctx = donation.ai_context || {};

  const handleStatusChange = (newStatus) => {
    updateDonation(donation.id, { status: newStatus });
    onUpdate();
  };

  const handleRecipientConfirm = () => {
    updateDonation(donation.id, { recipient_confirmed: true });
    onUpdate();
  };

  const handleProofUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingProof(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setTimeout(() => {
        updateDonation(donation.id, { proof_image_url: event.target.result });
        setUploadingProof(false);
        onUpdate();
      }, 800);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6 animate-fade-in">

      {/* ── Header ── */}
      <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-cyan-50 to-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] bg-amazon-teal text-white font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              Incoming Donation
            </span>
            <span className="text-[10px] text-gray-400 font-mono">#{donation.id.split("_")[2]?.toUpperCase()}</span>
          </div>
          <h3 className="text-lg font-extrabold text-gray-900">{donation.productName}</h3>
          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1.5">
            <span className="flex items-center gap-1">
              From: <strong className="text-gray-800 ml-1">{donation.donor_name}</strong>
            </span>
            <span className="flex items-center gap-1 text-amazon-teal font-semibold">
              <MapPin className="w-3.5 h-3.5" /> {donation.distance} km away
            </span>
          </div>
        </div>

        {/* Why you were selected */}
        <div className="bg-indigo-50 border border-indigo-100 px-4 py-2.5 rounded-xl flex-shrink-0 text-right">
          <p className="text-[9px] font-bold uppercase tracking-widest text-indigo-600 mb-0.5">AI Selected You</p>
          <p className="text-sm font-black text-indigo-900">Need Score: {donation.need_score || donation.ai_context?.candidates?.[0]?.need || 96}%</p>
          <p className="text-[10px] text-indigo-600">Best match among {ctx.candidates?.length || 3} candidates</p>
        </div>
      </div>

      {/* ── Timeline ── */}
      <ProgressTimeline status={donation.status} created_at={donation.created_at} completed_at={donation.completed_at} />

      {/* ── Main Body ── */}
      <div className="p-6 space-y-8">

        {/* ── Action Panel ── */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Your Action Required</h4>

          {donation.status === "MATCHED" && (
            <div className="p-6 border border-amazon-teal bg-cyan-50/30 rounded-xl text-center">
              <ShieldCheck className="w-10 h-10 text-amazon-teal mx-auto mb-3" />
              <p className="text-sm font-bold text-gray-900 mb-1">Donation Offered to You</p>
              <p className="text-xs text-gray-600 mb-5 max-w-sm mx-auto">
                Amazon's AI matched this item specifically to you based on your need profile. Accept to proceed with the handover.
              </p>
              <button
                onClick={() => handleStatusChange("ACCEPTED")}
                className="px-8 py-2.5 bg-amazon-teal text-white text-xs font-bold rounded-full hover:bg-cyan-700 hover:scale-105 transition-all shadow-sm"
              >
                Accept Donation
              </button>
            </div>
          )}

          {donation.status === "ACCEPTED" && (
            <div className="p-6 border border-gray-200 bg-gray-50 rounded-xl text-center">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Brain className="w-5 h-5 text-gray-400 animate-pulse" />
              </div>
              <p className="text-sm font-bold text-gray-900 mb-1">Waiting for Donor</p>
              <p className="text-xs text-gray-500">
                {donation.donor_name} is preparing the item and will generate a verification QR code. You will need to scan it on meetup.
              </p>
            </div>
          )}

          {donation.status === "HANDOVER_PENDING" && (
            <div className="p-5 border border-amazon-teal bg-cyan-50/30 rounded-xl">
              {donation.recipient_confirmed ? (
                <div className="flex flex-col items-center justify-center py-8 bg-emerald-50 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3" />
                  <p className="text-sm font-bold text-emerald-900">Code Verified Successfully</p>
                  <p className="text-xs text-emerald-700 mt-1">Waiting for donor to confirm delivery...</p>
                </div>
              ) : (
                <DonationQRScanner
                  expectedCode={donation.verification_code}
                  onVerify={handleRecipientConfirm}
                />
              )}
            </div>
          )}

          {(donation.status === "VERIFIED" || donation.status === "CREDITS_RELEASED") && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-900">Donation Received!</h3>
                  <p className="text-sm text-emerald-700 mt-0.5">
                    This item is now yours. The donor's Green Credits have been released.
                  </p>
                </div>
              </div>

              {/* Proof upload */}
              <div className="mt-5 pt-5 border-t border-emerald-200/60">
                {donation.proof_image_url ? (
                  <div className="flex items-center gap-4 bg-white/60 p-3 rounded-xl border border-emerald-100">
                    <img
                      src={donation.proof_image_url}
                      alt="Proof"
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5" /> Photo Proof Uploaded
                      </p>
                      <p className="text-[10px] text-emerald-600 mt-0.5">Thank you for verifying the condition.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/60 p-4 rounded-xl border border-dashed border-emerald-300">
                    <div>
                      <p className="text-xs font-bold text-gray-800">Optional: Upload Proof Photo</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">Take a photo of the received item to help future donors trust the process.</p>
                    </div>
                    <div>
                      <input type="file" id={`proof-${donation.id}`} className="hidden" accept="image/*" onChange={handleProofUpload} />
                      <label
                        htmlFor={`proof-${donation.id}`}
                        className="px-4 py-2 bg-white border border-gray-300 hover:border-emerald-500 text-gray-700 text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-2 shadow-sm"
                      >
                        {uploadingProof ? "Uploading..." : <><Camera className="w-4 h-4" /> Upload Photo</>}
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Why You Were Chosen ── */}
        {ctx.matching_reason && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Why You Were Selected</h4>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="bg-indigo-600 p-1.5 rounded-lg flex-shrink-0 mt-0.5">
                  <Brain className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-indigo-900 mb-1">AI Selection Reasoning</p>
                  <p className="text-xs text-indigo-800 leading-relaxed">{ctx.matching_reason}</p>
                  {ctx.candidates && (
                    <p className="text-[10px] text-indigo-600 mt-2 font-semibold">
                      Selected from {ctx.candidates.length} candidates evaluated.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Product Passport + AI Decision ── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-blue-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Item Intelligence</h4>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ProductPassportCard passport={ctx.passport} />
            <AIRoutingDecisionCard decision={ctx.routing_decision} />
          </div>
        </div>

        {/* ── Impact Story ── */}
        {ctx.impact && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm">🌍</span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Your Impact</h4>
            </div>
            <ImpactStoryCard impact={ctx.impact} />
          </div>
        )}

      </div>
    </div>
  );
}
