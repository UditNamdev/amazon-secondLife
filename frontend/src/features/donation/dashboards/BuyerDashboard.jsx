import React, { useState } from "react";
import { CheckCircle2, ShieldCheck, Camera, ImageIcon, Gift } from "lucide-react";
import { updateDonation } from "../../../services/donationStore";
import { DonationQRScanner } from "../DonationQR";
import { ProgressTimeline } from "./SharedComponents";

export default function BuyerDashboard({ donation, onUpdate }) {
  const [uploadingProof, setUploadingProof] = useState(false);

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
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col mb-6">
      <div className="p-5 border-b border-gray-100 bg-gray-50">
        <span className="text-[10px] bg-amazon-teal text-white font-bold px-2 py-0.5 rounded uppercase tracking-wider">
          Incoming Donation
        </span>
        <h3 className="text-lg font-extrabold text-gray-900 mt-2">{donation.productName}</h3>
        <p className="text-xs text-gray-600 mt-1">From: {donation.donor_name} ({donation.distance} km away)</p>
      </div>

      <ProgressTimeline status={donation.status} />

      <div className="p-6">
        <h3 className="font-bold text-gray-800 mb-4">Your Action Required</h3>

        {donation.status === "MATCHED" && (
          <div className="p-6 border border-amazon-teal bg-cyan-50/30 rounded-xl text-center">
            <ShieldCheck className="w-8 h-8 text-amazon-teal mx-auto mb-2" />
            <p className="text-sm font-bold text-gray-900">Donation Offered</p>
            <p className="text-xs text-gray-600 mb-4">Please accept this donation to proceed with the handover.</p>
            <button 
              onClick={() => handleStatusChange("ACCEPTED")}
              className="px-6 py-2 bg-amazon-teal text-white text-xs font-bold rounded-full hover:bg-cyan-700"
            >
              Accept Donation
            </button>
          </div>
        )}

        {donation.status === "ACCEPTED" && (
          <div className="p-6 border border-gray-200 bg-gray-50 rounded-xl text-center">
             <p className="text-sm font-bold text-gray-900">Waiting for Donor</p>
             <p className="text-xs text-gray-600">The donor is generating the verification QR code. You will need to scan it upon meetup.</p>
          </div>
        )}

        {donation.status === "HANDOVER_PENDING" && (
          <div className="p-6 border border-amazon-teal bg-cyan-50/30 rounded-xl">
             {donation.recipient_confirmed ? (
                <div className="flex flex-col items-center justify-center h-48 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800">
                  <CheckCircle2 className="w-10 h-10 mb-2" />
                  <p className="text-sm font-bold">Code Verified</p>
                  <p className="text-xs mt-1">Waiting for donor confirmation...</p>
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
                  <h3 className="text-lg font-bold text-emerald-900">Donation Received Successfully!</h3>
                  <p className="text-sm text-emerald-700 mt-1">The Green Credits have been released to the donor.</p>
                </div>
             </div>
             
             {/* Proof Upload */}
             <div className="mt-6 pt-5 border-t border-emerald-200/60">
              {donation.proof_image_url ? (
                <div className="flex items-center gap-4 bg-white/60 p-3 rounded-lg border border-emerald-100">
                  <img src={donation.proof_image_url} alt="Proof" className="w-16 h-16 object-cover rounded-md border border-gray-200" />
                  <div>
                    <p className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5" /> Photo Proof Uploaded
                    </p>
                    <p className="text-[10px] text-emerald-600 mt-0.5">Thank you for helping verify the condition.</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/60 p-4 rounded-lg border border-dashed border-emerald-300">
                  <div>
                    <p className="text-xs font-bold text-gray-800">Optional: Upload Proof Photo</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Take a photo of the received item.</p>
                  </div>
                  <div>
                    <input 
                      type="file" 
                      id={`proof-${donation.id}`} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleProofUpload}
                    />
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

        <div className="mt-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
             <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">Trust & Verification</h4>
             <div className="flex gap-4">
                <div className="bg-white p-3 rounded border border-gray-200 flex-1 text-center">
                   <p className="text-[10px] text-gray-500 font-bold uppercase">Condition Score</p>
                   <p className="text-lg font-black text-amazon-teal">92/100</p>
                </div>
                <div className="bg-white p-3 rounded border border-gray-200 flex-1 text-center">
                   <p className="text-[10px] text-gray-500 font-bold uppercase">AI Grade</p>
                   <p className="text-lg font-black text-amazon-teal">Very Good</p>
                </div>
             </div>
             <p className="text-[10px] text-gray-400 mt-2 text-center flex justify-center items-center gap-1">
               <ShieldCheck className="w-3 h-3" /> Verified by Amazon AI
             </p>
          </div>
        </div>

      </div>
    </div>
  );
}
