// frontend/src/services/donationStore.js

const STORE_KEY = "p2p_donations";

function getStore() {
  try {
    const data = localStorage.getItem(STORE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to parse donation store", e);
    return [];
  }
}

function saveStore(data) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save donation store", e);
  }
}

export function listDonations() {
  return getStore();
}

export function getDonation(id) {
  return getStore().find((d) => d.id === id);
}

export function getDonationByCode(code) {
  return getStore().find((d) => d.verification_code === code);
}

export function createDonation(payload) {
  const store = getStore();
  const newDonation = {
    id: `don_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    status: "MATCHED",
    verification_code: `DONATION_${Math.floor(100000 + Math.random() * 900000)}`,
    donor_confirmed: false,
    recipient_confirmed: false,
    credits_status: "pending",
    created_at: new Date().toISOString(),
    completed_at: null,
    proof_image_url: null,
    ...payload,
  };
  
  // Add to beginning of list
  store.unshift(newDonation);
  saveStore(store);
  return newDonation;
}

export function updateDonation(id, patch) {
  const store = getStore();
  const index = store.findIndex((d) => d.id === id);
  if (index === -1) throw new Error("Donation not found");
  
  const updated = { ...store[index], ...patch };
  
  // Logic to auto-advance to VERIFIED and release credits
  if (updated.donor_confirmed && updated.recipient_confirmed && updated.status === "HANDOVER_PENDING") {
    updated.status = "VERIFIED";
  }
  
  if (updated.status === "VERIFIED" && updated.credits_status === "pending") {
    updated.status = "CREDITS_RELEASED";
    updated.credits_status = "released";
    updated.completed_at = new Date().toISOString();
  }

  store[index] = updated;
  saveStore(store);
  return updated;
}

// ─── Rich Demo Data Generators ──────────────────────────────────────────────────

const DEMO_TEMPLATES = [
  {
    productName: "Infant Baby Monitor v2", category: "Electronics", distance: 1.2,
    donor_name: "Rahul M.", recipient_name: "Priya S.", recipient_type: "New Parent",
    ai_context: {
      candidates: [
        { name: "Priya S.", need: 96, dist: 1.2, trust: 94, match: 100 },
        { name: "Aman K.", need: 82, dist: 5.4, trust: 88, match: 80 },
        { name: "Riya P.", need: 75, dist: 8.1, trust: 90, match: 70 }
      ],
      matching_reason: "Priya S. has the highest urgent need score (96%) for infant care electronics and is the closest verified recipient (1.2km).",
      routing_decision: { resale: 15, refurb: 10, donate: 95, reason: "Baby monitors have low secondary market resale value but extremely high local community demand." },
      passport: { score: "94/100", grade: "Like New", owners: 1, damage: "None", battery: "98%", confidence: "99%" },
      credits: { base: 40, local: 30, carbon: 20, fast: 10, total: 100 },
      impact: { carbon: "2.1 kg", logistics: "₹150", waste: "1 Device", story: "This baby monitor was matched with a verified new parent living 1.2 km away, saving 2.1kg of carbon emissions compared to warehouse routing." }
    }
  },
  {
    productName: "MacBook Air M1 (2020)", category: "Computers", distance: 3.5,
    donor_name: "Ananya D.", recipient_name: "Arjun T.", recipient_type: "College Student",
    ai_context: {
      candidates: [
        { name: "Arjun T.", need: 92, dist: 3.5, trust: 98, match: 95 },
        { name: "Sarah W.", need: 85, dist: 4.2, trust: 91, match: 90 }
      ],
      matching_reason: "Arjun is a verified computer science student needing a primary device. The M1 chip perfectly matches his major's requirements.",
      routing_decision: { resale: 60, refurb: 45, donate: 88, reason: "While resale value is moderate, the device has minor cosmetic wear. Donating directly to a student yields the highest overall platform utility score." },
      passport: { score: "82/100", grade: "Good", owners: 1, damage: "Minor lid scratch", battery: "84%", confidence: "96%" },
      credits: { base: 100, local: 20, carbon: 40, fast: 15, total: 175 },
      impact: { carbon: "14.5 kg", logistics: "₹450", waste: "1 Laptop", story: "This functional MacBook Air was matched with a local college student, completely eliminating e-waste processing and fulfilling a critical educational need." }
    }
  },
  {
    productName: "Advanced Engineering Math Textbook", category: "Books", distance: 0.8,
    donor_name: "Karan V.", recipient_name: "Neha R.", recipient_type: "University Student",
    ai_context: {
      candidates: [
        { name: "Neha R.", need: 98, dist: 0.8, trust: 99, match: 100 },
        { name: "Vikas M.", need: 70, dist: 12.5, trust: 85, match: 60 }
      ],
      matching_reason: "Neha is enrolled in the exact course this textbook covers and lives in the same university district (0.8km).",
      routing_decision: { resale: 5, refurb: 0, donate: 99, reason: "Textbooks have near-zero commercial resale value due to edition churn, but absolute maximum utility for local students." },
      passport: { score: "88/100", grade: "Very Good", owners: 2, damage: "Cover wear", battery: "N/A", confidence: "100%" },
      credits: { base: 20, local: 40, carbon: 10, fast: 20, total: 90 },
      impact: { carbon: "1.2 kg", logistics: "₹80", waste: "1 Book", story: "By matching this heavy textbook locally, we saved 1.2kg in shipping emissions and provided essential study material within 24 hours." }
    }
  }
];

export function generateDemoPayload() {
  const template = DEMO_TEMPLATES[Math.floor(Math.random() * DEMO_TEMPLATES.length)];
  return {
    product_id: `demo_${Math.floor(Math.random() * 10000)}`,
    ...template,
    need_score: template.ai_context.candidates[0].need,
    green_credits: template.ai_context.credits.total
  };
}
