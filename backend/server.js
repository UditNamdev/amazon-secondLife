// server.js — Entry point for SecondLife returns grading platform
import app from "./src/app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n🚀 SecondLife API server running on http://localhost:${PORT}`);
  console.log(`\n   POST /grade          — upload photos + grade a product`);
  console.log(`   POST /upload         — get presigned S3 upload URL`);
  console.log(`   GET  /item/:id       — fetch a graded item`);
  console.log(`   GET  /requirements   — get capture requirements`);
  console.log(`   GET  /health         — health check\n`);
});
