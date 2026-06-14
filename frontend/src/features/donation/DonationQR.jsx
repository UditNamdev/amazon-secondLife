// frontend/src/features/donation/DonationQR.jsx
import React, { useState } from "react";
import { QrCode, ScanLine, CheckCircle2, AlertCircle } from "lucide-react";

export function DonationQRDisplay({ verificationCode }) {
  // Use a free API to generate the QR code image without needing a new npm package
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(verificationCode)}&margin=10`;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 mb-3">
        <img src={qrUrl} alt="Donation QR Code" className="w-48 h-48 mix-blend-multiply" />
      </div>
      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Verification Code</p>
      <div className="bg-amazon-teal/10 text-amazon-teal px-4 py-1.5 rounded-full font-mono font-bold text-lg tracking-widest border border-amazon-teal/20">
        {verificationCode}
      </div>
      <p className="text-[11px] text-gray-500 mt-3 text-center px-4">
        Ask the recipient to scan this QR code or enter the code manually to verify the handover.
      </p>
    </div>
  );
}

export function DonationQRScanner({ expectedCode, onVerify }) {
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleVerify = (e) => {
    e.preventDefault();
    if (inputCode.trim().toUpperCase() === expectedCode.toUpperCase()) {
      setSuccess(true);
      setError("");
      setTimeout(() => {
        onVerify();
      }, 1500);
    } else {
      setError("Invalid verification code. Please check and try again.");
      setSuccess(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-emerald-50 border border-emerald-200 rounded-xl animate-fade-in text-center">
        <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-md">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-lg font-bold text-emerald-900">Code Verified!</h3>
        <p className="text-xs text-emerald-700 mt-1">Donation received successfully.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <ScanLine className="w-5 h-5 text-amazon-teal" />
        <h3 className="text-sm font-bold text-gray-900">Scan QR or Enter Code</h3>
      </div>
      
      <p className="text-xs text-gray-600 mb-4">
        Enter the verification code shown on the donor's screen to confirm you have received the item.
      </p>

      <form onSubmit={handleVerify} className="space-y-3">
        <div>
          <input
            type="text"
            placeholder="e.g. DONATION_123456"
            value={inputCode}
            onChange={(e) => {
              setInputCode(e.target.value);
              setError("");
            }}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center font-mono font-bold tracking-widest text-lg uppercase focus:outline-none focus:border-amazon-teal focus:ring-1 focus:ring-amazon-teal"
          />
        </div>
        
        {error && (
          <div className="flex items-center gap-1.5 text-rose-600 text-xs font-semibold bg-rose-50 p-2 rounded-md">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!inputCode.trim()}
          className="w-full py-2.5 bg-amazon-teal hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <QrCode className="w-4 h-4" /> Verify Handover
        </button>
      </form>
    </div>
  );
}
