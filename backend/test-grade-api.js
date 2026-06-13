// test-grade-api.js — Quick test for POST /grade endpoint
import { readFileSync } from "node:fs";

const IMAGE_PATH = "C:\\Users\\abhay\\.gemini\\antigravity-ide\\brain\\62ae0bc7-8f3b-4ad6-9dd8-5ffd69c408d1\\returned_phone_1781375543359.png";

const form = new FormData();
form.append("category", "electronics");
form.append("provided", JSON.stringify({ model: "iPhone 13", imei: "3531..." }));
form.append("images", new Blob([readFileSync(IMAGE_PATH)], { type: "image/png" }), "phone.png");

const res = await fetch("http://localhost:3000/grade", {
  method: "POST",
  headers: { "X-User-Role": "seller" },
  body: form,
});

const data = await res.json();
console.log("\n✅ POST /grade response:\n");
console.log(JSON.stringify(data, null, 2));

// Now test GET /item/:id
if (data.success) {
  const itemId = data.item.itemId;
  const itemRes = await fetch(`http://localhost:3000/item/${itemId}`, {
    headers: { "X-User-Role": "seller" },
  });
  const itemData = await itemRes.json();
  console.log("\n✅ GET /item/:id response:\n");
  console.log(JSON.stringify(itemData, null, 2));
}
