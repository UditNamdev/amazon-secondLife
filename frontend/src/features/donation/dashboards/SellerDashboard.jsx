import React from "react";
import { ArrowRight, RefreshCw, HandHeart, Trash2, DollarSign, BrainCircuit } from "lucide-react";
import { AIRecommendationPanel } from "./SharedComponents";

export default function SellerDashboard({ donations }) {
  // Use the latest donation as the returned item for the seller
  const latestDonation = donations[0] || {
    productName: "Sample Product",
    category: "Electronics",
    distance: 2.0
  };

  return (
    <div className="space-y-6">
      
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-6 items-center">
         <div className="flex-1">
            <span className="text-[10px] bg-gray-200 text-gray-700 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
               Returned Item Tracking
            </span>
            <h2 className="text-xl font-extrabold text-gray-900 mt-2">{latestDonation.productName}</h2>
            <p className="text-sm text-gray-500 mt-1">Item ID: RTN-{Math.floor(Math.random() * 10000)}</p>
         </div>
         <div className="flex-shrink-0 bg-blue-50 border border-blue-200 px-6 py-4 rounded-xl text-center">
            <p className="text-[10px] font-bold uppercase text-blue-500 tracking-wider">AI Route Decision</p>
            <p className="text-lg font-black text-blue-900 mt-1">Community Donation</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Left Column: Value Recovery */}
         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
               <DollarSign className="w-5 h-5 text-emerald-500" /> Value Recovery
            </h3>
            
            <div className="space-y-4">
               <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="text-sm text-gray-600">Original Item Value</span>
                  <span className="font-mono text-sm">₹ 2,499</span>
               </div>
               <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="text-sm text-gray-600">Logistics Cost Saved</span>
                  <span className="font-mono text-sm text-emerald-600">+ ₹ 150</span>
               </div>
               <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="text-sm text-gray-600">Green Credits Earned</span>
                  <span className="font-mono text-sm text-emerald-600">+ 100 Cr</span>
               </div>
               <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-lg border border-emerald-100 mt-2">
                  <span className="text-sm font-bold text-emerald-900">Total Recovery %</span>
                  <span className="font-black text-lg text-emerald-700">62%</span>
               </div>
            </div>
         </div>

         {/* Right Column: AI Explanation */}
         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
               <BrainCircuit className="w-5 h-5 text-purple-500" /> AI Routing Logic
            </h3>
            
            <div className="space-y-4">
               <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <RefreshCw className="w-4 h-4 text-gray-400" />
                     <span className="text-sm font-bold text-gray-700">Resale Probability</span>
                  </div>
                  <span className="text-sm font-black text-amber-600">25%</span>
               </div>
               
               <div className="bg-emerald-50 p-3 rounded-lg flex items-center justify-between border border-emerald-200">
                  <div className="flex items-center gap-2">
                     <HandHeart className="w-4 h-4 text-emerald-600" />
                     <span className="text-sm font-bold text-emerald-800">Donation Success Probability</span>
                  </div>
                  <span className="text-sm font-black text-emerald-700">92%</span>
               </div>

               <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-2">
                     <Trash2 className="w-4 h-4 text-gray-400" />
                     <span className="text-sm font-bold text-gray-700">Recycle Requirement</span>
                  </div>
                  <span className="text-sm font-black text-gray-500">2%</span>
               </div>
               
               <p className="text-xs text-purple-800 bg-purple-50 p-3 rounded-lg mt-4 border border-purple-100">
                  <strong>Reasoning:</strong> Low resale demand for this model in its current condition. High local need identified within {latestDonation.distance} km. Routing to P2P donation maximizes item utility and saves carbon emissions.
               </p>
            </div>
         </div>
      </div>

      <AIRecommendationPanel 
         distance={latestDonation.distance} 
         reason="P2P Community Donation chosen to prevent warehouse shipping and fulfill immediate local need."
         carbonSaving="82%"
      />
    </div>
  );
}
