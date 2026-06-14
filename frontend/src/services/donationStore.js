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
  store.unshift(newDonation);
  saveStore(store);
  return newDonation;
}

export function updateDonation(id, patch) {
  const store = getStore();
  const index = store.findIndex((d) => d.id === id);
  if (index === -1) throw new Error("Donation not found");

  const updated = { ...store[index], ...patch };

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

// ─── Rich Demo Templates ─────────────────────────────────────────────────────

const DEMO_TEMPLATES = [
  {
    productName: "Infant Baby Monitor Pro v2",
    category: "Baby Care",
    distance: 1.2,
    donor_name: "Rahul M.",
    recipient_name: "Priya S.",
    recipient_type: "New Parent",
    ai_context: {
      candidates: [
        { name: "Priya S.", need: 96, dist: 1.2, trust: 94, match: 100 },
        { name: "Aman K.", need: 82, dist: 5.4, trust: 88, match: 80 },
        { name: "Riya P.", need: 75, dist: 8.1, trust: 90, match: 70 },
        { name: "Suresh V.", need: 61, dist: 11.3, trust: 85, match: 55 },
      ],
      matching_reason: "Priya S. has the highest urgent need score (96%) for infant care electronics and is the closest verified recipient at 1.2 km. Trust score of 94% ensures safe handover.",
      routing_decision: {
        resale: 15,
        refurb: 8,
        donate: 95,
        carbon: 88,
        reason: "Baby monitors have extremely low secondary market value but near-100% local community demand. Hyperlocal delivery cuts carbon footprint by 88% vs warehouse routing.",
      },
      passport: { score: "94/100", grade: "Like New", owners: 1, damage: "None", battery: "98%", confidence: "99%" },
      credits: { base: 40, local: 30, carbon: 20, fast: 10, total: 100 },
      impact: {
        carbon: "2.1 kg CO₂",
        logistics: "₹150",
        waste: "1 Device",
        families: "1 Family",
        story: "This baby monitor was matched with a verified new parent living 1.2 km away, saving 2.1 kg of carbon emissions compared to warehouse routing — and helping a family in real need.",
      },
    },
  },
  {
    productName: "MacBook Air M1 (2020)",
    category: "Computers",
    distance: 3.5,
    donor_name: "Ananya D.",
    recipient_name: "Arjun T.",
    recipient_type: "College Student",
    ai_context: {
      candidates: [
        { name: "Arjun T.", need: 92, dist: 3.5, trust: 98, match: 95 },
        { name: "Sarah W.", need: 85, dist: 4.2, trust: 91, match: 90 },
        { name: "Mohit R.", need: 79, dist: 6.1, trust: 87, match: 72 },
      ],
      matching_reason: "Arjun is a verified CS student needing a primary device. The M1 chip and software profile perfectly match his program requirements. Highest trust score (98%) of all candidates.",
      routing_decision: {
        resale: 58,
        refurb: 42,
        donate: 88,
        carbon: 72,
        reason: "Minor cosmetic wear reduces resale viability. Donating directly to a verified student maximises platform utility score and eliminates e-waste processing entirely.",
      },
      passport: { score: "82/100", grade: "Good", owners: 1, damage: "Minor lid scratch", battery: "84%", confidence: "96%" },
      credits: { base: 100, local: 20, carbon: 40, fast: 15, total: 175 },
      impact: {
        carbon: "14.5 kg CO₂",
        logistics: "₹450",
        waste: "1 Laptop",
        families: "1 Student",
        story: "This functional MacBook Air was matched with a local CS student, completely eliminating e-waste processing and fulfilling a critical educational need within 24 hours.",
      },
    },
  },
  {
    productName: "Advanced Engineering Mathematics Textbook",
    category: "Books",
    distance: 0.8,
    donor_name: "Karan V.",
    recipient_name: "Neha R.",
    recipient_type: "University Student",
    ai_context: {
      candidates: [
        { name: "Neha R.", need: 98, dist: 0.8, trust: 99, match: 100 },
        { name: "Vikas M.", need: 70, dist: 12.5, trust: 85, match: 60 },
      ],
      matching_reason: "Neha is enrolled in the exact course this textbook covers and lives in the same university district (0.8 km). Perfect subject match with zero logistics overhead.",
      routing_decision: {
        resale: 5,
        refurb: 0,
        donate: 99,
        carbon: 95,
        reason: "Textbooks have near-zero commercial resale value due to edition churn, but absolute maximum utility for local students. Foot-delivery eliminates all transport emissions.",
      },
      passport: { score: "88/100", grade: "Very Good", owners: 2, damage: "Cover wear only", battery: "N/A", confidence: "100%" },
      credits: { base: 20, local: 40, carbon: 10, fast: 20, total: 90 },
      impact: {
        carbon: "1.2 kg CO₂",
        logistics: "₹80",
        waste: "1 Book",
        families: "1 Student",
        story: "By matching this heavy textbook locally, we saved 1.2 kg in shipping emissions and provided essential study material to a student who needed it for exams this week.",
      },
    },
  },
  {
    productName: "Ergonomic Study Chair (Mesh Back)",
    category: "Furniture",
    distance: 2.3,
    donor_name: "Siddharth P.",
    recipient_name: "Meera L.",
    recipient_type: "Work-from-home Parent",
    ai_context: {
      candidates: [
        { name: "Meera L.", need: 89, dist: 2.3, trust: 92, match: 97 },
        { name: "Deepak N.", need: 78, dist: 4.7, trust: 88, match: 80 },
        { name: "Fatima A.", need: 65, dist: 9.2, trust: 94, match: 60 },
      ],
      matching_reason: "Meera is a verified work-from-home parent with documented back pain, making the ergonomic chair a near-perfect match. Closest verified recipient with highest category match.",
      routing_decision: {
        resale: 30,
        refurb: 18,
        donate: 91,
        carbon: 78,
        reason: "Second-hand furniture resale has high logistics friction and uncertain demand. Local donation eliminates bulky-item shipping costs (est. ₹600 saved) and cuts 4.8 kg CO₂.",
      },
      passport: { score: "86/100", grade: "Very Good", owners: 1, damage: "Minor armrest wear", battery: "N/A", confidence: "97%" },
      credits: { base: 35, local: 25, carbon: 15, fast: 10, total: 85 },
      impact: {
        carbon: "4.8 kg CO₂",
        logistics: "₹600",
        waste: "1 Chair",
        families: "1 Family",
        story: "This ergonomic chair was matched with a work-from-home parent 2.3 km away, preventing bulky-item landfill disposal and saving an estimated 4.8 kg of transport emissions.",
      },
    },
  },
  {
    productName: "North Face Winter Jacket (Size M)",
    category: "Clothing",
    distance: 1.7,
    donor_name: "Pooja S.",
    recipient_name: "Rajan K.",
    recipient_type: "Delivery Worker",
    ai_context: {
      candidates: [
        { name: "Rajan K.", need: 94, dist: 1.7, trust: 96, match: 98 },
        { name: "Sunita D.", need: 88, dist: 3.1, trust: 91, match: 85 },
        { name: "Ahmed F.", need: 82, dist: 5.4, trust: 89, match: 79 },
      ],
      matching_reason: "Rajan is a verified outdoor delivery worker facing winter without adequate gear. Size M is a perfect fit. Highest need score and second-nearest verified recipient.",
      routing_decision: {
        resale: 22,
        refurb: 5,
        donate: 94,
        carbon: 82,
        reason: "Pre-loved outerwear has low resale demand. Immediate local donation to an outdoor worker with documented need creates maximum social impact with minimal logistics footprint.",
      },
      passport: { score: "90/100", grade: "Like New", owners: 1, damage: "None detected", battery: "N/A", confidence: "98%" },
      credits: { base: 30, local: 28, carbon: 18, fast: 14, total: 90 },
      impact: {
        carbon: "3.2 kg CO₂",
        logistics: "₹120",
        waste: "1 Jacket",
        families: "1 Worker",
        story: "This winter jacket was matched with a local delivery worker who braves cold weather daily. Hyperlocal handover saved 3.2 kg CO₂ and provided immediate warmth this season.",
      },
    },
  },
];

export function generateDemoPayload() {
  const template = DEMO_TEMPLATES[Math.floor(Math.random() * DEMO_TEMPLATES.length)];
  return {
    product_id: `demo_${Math.floor(Math.random() * 10000)}`,
    ...template,
    need_score: template.ai_context.candidates[0].need,
    green_credits: template.ai_context.credits.total,
  };
}

export function seedDemoIfEmpty() {
  const store = getStore();
  if (store.length === 0) {
    const template = DEMO_TEMPLATES[0];
    const seeded = {
      id: `don_seed_baby`,
      status: "MATCHED",
      verification_code: `DONATION_482917`,
      donor_confirmed: false,
      recipient_confirmed: false,
      credits_status: "pending",
      created_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      completed_at: null,
      proof_image_url: null,
      product_id: "demo_seed_001",
      ...template,
      need_score: template.ai_context.candidates[0].need,
      green_credits: template.ai_context.credits.total,
    };
    store.unshift(seeded);
    saveStore(store);
  }
}
