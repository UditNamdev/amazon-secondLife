import React from "react";
import { Package, Users, Activity, CheckCircle2 } from "lucide-react";
import { SustainabilityImpactPanel } from "./SharedComponents";

export default function NGODashboard({ donations }) {
  // Aggregate mock metrics based on donations array (and adding some mock padding for visual richness)
  const totalDonations = donations.length + 142;
  const verifiedDonations = donations.filter(d => d.status === "VERIFIED" || d.status === "CREDITS_RELEASED").length + 115;
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-amazon-teal" /> Operations Overview
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <MetricCard title="Total Received" value={totalDonations} icon={<Package />} />
          <MetricCard title="Verified Handover" value={verifiedDonations} icon={<CheckCircle2 />} />
          <MetricCard title="Pending Pickup" value={totalDonations - verifiedDonations} icon={<Package className="text-amber-500" />} />
          <MetricCard title="Active Campaigns" value="3" icon={<Users />} />
        </div>

        <h3 className="font-bold text-gray-800 mb-3 text-sm">Inventory by Category</h3>
        <div className="flex gap-2">
           <CategoryPill label="Electronics" count={45} />
           <CategoryPill label="Books" count={120} />
           <CategoryPill label="Clothing" count={85} />
           <CategoryPill label="Baby" count={12} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
         <h2 className="text-lg font-bold text-gray-900 mb-4">Organization Impact</h2>
         <SustainabilityImpactPanel carbon="850 kg" logistics="₹ 12,400" waste="262 Items" people="140 Families" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
         <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h2 className="text-sm font-bold text-gray-900">Recent Donation Queue</h2>
            <button className="text-xs font-bold text-amazon-teal hover:underline">View All</button>
         </div>
         <div className="divide-y divide-gray-100">
            {donations.length === 0 ? (
               <div className="p-6 text-center text-sm text-gray-500">No active local donations</div>
            ) : (
               donations.map((d, i) => (
                  <div key={i} className="p-4 px-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                     <div>
                        <p className="text-sm font-bold text-gray-900">{d.productName}</p>
                        <p className="text-xs text-gray-500">{d.donor_name} • {d.distance} km</p>
                     </div>
                     <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${d.status === "VERIFIED" || d.status === "CREDITS_RELEASED" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {d.status.replace("_", " ")}
                     </span>
                  </div>
               ))
            )}
         </div>
      </div>

    </div>
  );
}

function MetricCard({ title, value, icon }) {
  return (
    <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg">
      <div className="text-gray-400 mb-2">{React.cloneElement(icon, { className: "w-5 h-5" })}</div>
      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{title}</p>
      <p className="text-xl font-black text-gray-900">{value}</p>
    </div>
  );
}

function CategoryPill({ label, count }) {
  return (
    <div className="px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full flex items-center gap-2">
      <span className="text-xs font-bold text-blue-900">{label}</span>
      <span className="bg-blue-200 text-blue-900 text-[10px] font-bold px-1.5 rounded">{count}</span>
    </div>
  );
}
