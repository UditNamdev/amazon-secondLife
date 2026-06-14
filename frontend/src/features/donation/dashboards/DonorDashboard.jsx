import React from "react";
import { Lock, Unlock, MapPin, Users, Package, ShieldCheck, Gift, Globe, ImageIcon, Camera } from "lucide-react";
import { updateDonation } from "../../../services/donationStore";
import { DonationQRDisplay } from "../DonationQR";
import { ProgressTimeline, AIRecommendationPanel, GreenCreditBreakdownCard, ImpactStoryCard } from "./SharedComponents";

export default function DonorDashboard({ donation, onUpdate }) {
  const handleDonorConfirm = () => {
    updateDonation(donation.id, { donor_confirmed: true });
    onUpdate();
  };

  const handleStatusChange = (newStatus) => {
    updateDonation(donation.id, { status: newStatus });
    onUpdate();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col mb-6 animate-fade-in">
      {/* Header Info */}
      <div className="p-5 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] bg-amazon-teal text-white font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              {donation.category}
            </span>
            <span className="text-xs text-gray-500 font-mono">ID: {donation.id.split('_')[2]}</span>
          </div>
          <h3 className="text-lg font-extrabold text-gray-900">{donation.productName}</h3>
          <div className="flex items-center gap-3 text-xs text-gray-600 mt-1.5">
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Recipient: {donation.recipient_name}</span>
            <span className="flex items-center gap-1 text-amazon-teal font-semibold"><MapPin className="w-3.5 h-3.5" /> {donation.distance} km away</span>
          </div>
        </div>

        {/* Escrow Badge */}
        <div className={`px-4 py-2 rounded-lg border flex items-center gap-3 flex-shrink-0 ${
          donation.credits_status === "released" 
            ? "bg-emerald-50 border-emerald-200 shadow-sm" 
            : "bg-amber-50 border-amber-200"
        }`}>
          {donation.credits_status === "released" ? (
            <Unlock className="w-5 h-5 text-emerald-600" />
          ) : (
            <Lock className="w-5 h-5 text-amber-500" />
          )}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Escrow Status</p>
            <p className={`text-sm font-black ${donation.credits_status === "released" ? "text-emerald-700" : "text-amber-700"}`}>
              {donation.green_credits} Cr ({donation.credits_status})
            </p>
          </div>
        </div>
      </div>

      <ProgressTimeline status={donation.status} created_at={donation.created_at} completed_at={donation.completed_at} />

      <div className="p-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
           <div className="lg:col-span-2">
              <h3 className="font-bold text-gray-800 mb-4">Your Action Required</h3>
              
              {donation.status === "MATCHED" && (
                <div className="text-center p-6 border border-gray-200 rounded-xl bg-gray-50 hover:shadow-md transition-all">
                  <Users className="w-8 h-8 text-blue-500 mx-auto mb-2 animate-bounce" />
                  <p className="text-sm font-bold">Waiting for {donation.recipient_name} to accept...</p>
                  <p className="text-xs text-gray-500 mt-1">You will be notified once they accept the donation.</p>
                </div>
              )}

              {donation.status === "ACCEPTED" && (
                <div className="text-center p-6 border border-amber-200 rounded-xl bg-amber-50 hover:shadow-md transition-all">
                  <Package className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-amber-900">Donation Accepted!</p>
                  <p className="text-xs text-amber-700 mb-4">Please prepare the item for physical handover.</p>
                  <button 
                    onClick={() => handleStatusChange("HANDOVER_PENDING")}
                    className="px-6 py-2 bg-amazon-yellow text-gray-900 text-xs font-bold rounded-full border border-yellow-400 hover:bg-yellow-400 hover:scale-105 transition-all shadow-sm"
                  >
                    Generate Verification QR
                  </button>
                </div>
              )}

              {donation.status === "HANDOVER_PENDING" && (
                <div className="p-6 rounded-xl border border-amazon-teal bg-cyan-50/30 flex flex-col md:flex-row gap-6 hover:shadow-md transition-all">
                  <div className="flex-1">
                     <h4 className="text-sm font-bold text-gray-800 mb-2">Physical Handover</h4>
                     <p className="text-xs text-gray-600 mb-4">
                       Show this QR code to the recipient when you meet them. They need to scan it to verify receipt.
                     </p>
                     <button
                        onClick={handleDonorConfirm}
                        disabled={donation.donor_confirmed}
                        className={`w-full py-3 rounded-lg text-sm font-bold transition-all shadow-sm ${
                          donation.donor_confirmed 
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-amazon-teal text-white hover:bg-cyan-700 hover:-translate-y-0.5"
                        }`}
                      >
                        {donation.donor_confirmed ? "✓ Item Marked as Delivered" : "Mark Item Delivered"}
                      </button>
                  </div>
                  <div className="flex-shrink-0 flex justify-center bg-white p-2 rounded-xl border border-gray-200">
                     <DonationQRDisplay verificationCode={donation.verification_code} />
                  </div>
                </div>
              )}

              {donation.status === "VERIFIED" || donation.status === "CREDITS_RELEASED" ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center shadow-sm">
                  <Gift className="w-10 h-10 text-emerald-500 mx-auto mb-2 animate-pulse" />
                  <h3 className="text-lg font-bold text-emerald-900">Handover Complete</h3>
                  <p className="text-sm text-emerald-700 mt-1">Your Green Credits have been released!</p>
                </div>
              ) : null}
              
              <div className="mt-6">
                 <ImpactStoryCard impact={donation.ai_context?.impact} />
              </div>

           </div>
           
           <div>
              <GreenCreditBreakdownCard credits={donation.ai_context?.credits} />
           </div>
        </div>

      </div>
    </div>
  );
}
