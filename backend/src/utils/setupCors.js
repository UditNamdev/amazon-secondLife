// backend/src/utils/setupCors.js
import { S3Client, PutBucketCorsCommand } from "@aws-sdk/client-s3";
import {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  S3_BUCKET_NAME,
} from "../../config/setting.js";

const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

async function run() {
  console.log(`Setting up CORS for S3 bucket: "${S3_BUCKET_NAME}" in region: "${AWS_REGION}"...`);
  try {
    const corsConfig = {
      Bucket: S3_BUCKET_NAME,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ["*"],
            AllowedMethods: ["GET", "PUT", "POST", "HEAD"],
            AllowedOrigins: [
              "http://localhost:5173",
              "http://localhost:5174",
              "http://localhost:5175",
              "http://localhost:5176",
              "http://localhost:3000"
            ],
            ExposeHeaders: ["ETag"],
            MaxAgeSeconds: 3000,
          },
        ],
      },
    };

    await s3.send(new PutBucketCorsCommand(corsConfig));
    console.log("✅ CORS rules successfully applied to S3 bucket!");
  } catch (err) {
    console.error("❌ Failed to apply CORS rules:", err.message || err);
    process.exit(1);
  }
}

run();
