import React, { useState, useEffect } from "react";
import { ShieldCheck, Users } from "lucide-react";
import { listDonations } from "../../services/donationStore";
import DonorDashboard from "./dashboards/DonorDashboard";
import BuyerDashboard from "./dashboards/BuyerDashboard";
import NGODashboard from "./dashboards/NGODashboard";
import SellerDashboard from "./dashboards/SellerDashboard";

export default function DonationVerification({ role }) {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDonations = () => {
    setDonations(listDonations());
    setLoading(false);
  };

  useEffect(() => {
    loadDonations();
    const interval = setInterval(loadDonations, 2000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
  }

  // Create a mock donation if the store is empty just for demo visibility
  const displayDonations = donations.length > 0 ? donations : [];

  // Determine header context based on role
  const roleContext = {
    donor: {
      title: "Donor Handover Hub",
      desc: "Manage your pending physical handovers and track your incoming Green Credits."
    },
    buyer: {
      title: "Recipient Verification Hub",
      desc: "Safely receive donated items. Scan QR codes to verify handover and confirm item condition."
    },
    ngo: {
      title: "NGO Operations Command",
      desc: "Aggregate view of incoming donations, pending pickups, and community impact."
    },
    seller: {
      title: "Item Recovery & Routing",
      desc: "Track the post-return lifecycle of your item. See AI routing decisions and recovered value."
    }
  };

  const currentContext = roleContext[role] || roleContext.buyer;

  return (
    <div className="max-w-4xl mx-auto p-4 font-sans space-y-6">
      
      {/* Global Dashboard Header */}
      <div className="bg-gradient-to-r from-amazon-teal to-cyan-800 p-6 rounded-xl text-white shadow-md flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-cyan-300" /> {currentContext.title}
          </h1>
          <p className="text-sm text-cyan-100 mt-1 max-w-lg">
            {currentContext.desc}
          </p>
        </div>
        <div className="hidden sm:block text-right">
          <div className="text-[10px] uppercase font-bold text-cyan-200 tracking-widest mb-1">Active Persona</div>
          <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold uppercase backdrop-blur-sm border border-white/30">
            {role}
          </div>
        </div>
      </div>

      {/* Role-Based Dashboard Routing */}
      {donations.length === 0 && role !== "ngo" && role !== "seller" ? (
         <div className="max-w-4xl mx-auto p-8 text-center bg-white rounded-xl border border-gray-200 shadow-sm mt-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-gray-900">No active tracking</h2>
            <p className="text-sm text-gray-500 mt-2">There are no active items in your queue right now.</p>
            <button
               onClick={() => {
                  import("../../services/donationStore").then(({ createDonation }) => {
                     createDonation({
                        product_id: "demo_123",
                        productName: "Demo Baby Monitor",
                        category: "baby",
                        donor_id: "u_donor",
                        donor_name: "Rahul M.",
                        recipient_id: "u_recip",
                        recipient_name: "Priya S.",
                        recipient_type: "New parent",
                        distance: 2.0,
                        need_score: 95,
                        green_credits: 100
                     });
                     loadDonations();
                  });
               }}
               className="mt-6 px-6 py-2 bg-amazon-teal text-white font-bold rounded-full shadow hover:bg-cyan-700 transition-colors"
            >
               Generate Demo Item
            </button>
         </div>
      ) : (
        <div className="space-y-6">
          {role === "donor" && displayDonations.map(d => <DonorDashboard key={d.id} donation={d} onUpdate={loadDonations} />)}
          {role === "buyer" && displayDonations.map(d => <BuyerDashboard key={d.id} donation={d} onUpdate={loadDonations} />)}
          {role === "ngo" && <NGODashboard donations={displayDonations} />}
          {role === "seller" && <SellerDashboard donations={displayDonations} />}
        </div>
      )}

    </div>
  );
}
