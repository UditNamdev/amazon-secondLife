# Step 1 — AI Grading Gate

Prove the Bedrock grade call works before building anything else. When this prints a sensible grade, your project is viable.

## What these files are
- `grade.js` — standalone script: photo(s) + category + provided info → grade JSON
- `gradingRequirements.js` — category-aware capture/inspection rules (electronics, footwear, clothing, appliance)
- `package.json` — ESM + the AWS Bedrock SDK

## Prerequisites (do these first — access can lag)
1. **Enable Bedrock model access:** AWS console → **Bedrock → Model access** → request/enable a **Claude vision** model (Sonnet). Note the exact model id / inference-profile id and the region (e.g. `us-east-1`).
2. **AWS credentials** on your machine: run `aws configure` (or set `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` env vars). The IAM user needs `bedrock:InvokeModel` (and Converse) permission.
3. **Node 18+**.

## Install
```bash
npm install
```

## Configure the model (important gotcha)
Set the model id you enabled and its region. Bedrock often needs a region-prefixed inference-profile id:
```bash
export AWS_REGION="us-east-1"
export BEDROCK_MODEL_ID="us.anthropic.claude-3-5-sonnet-20241022-v2:0"   # use the exact id from your console
```

## Run the gate
Put a real product photo in this folder, then:
```bash
# electronics — with seller-provided info (IMEI / model / bill)
node grade.js electronics ./iphone.jpg '{"imei":"3531...","model":"iPhone 13","billProvided":true}'

# footwear — different required inputs, no IMEI
node grade.js footwear ./shoe.jpg

# multiple photos
node grade.js electronics ./front.jpg,./back.jpg,./screen.jpg '{"model":"iPhone 13"}'
```

## Expected output
```json
{
  "grade": "Very Good",
  "defects": ["minor scuff on bottom edge"],
  "completeness": "complete",
  "authenticityConcern": false,
  "confidence": 0.9,
  "notes": "Screen intact, light cosmetic wear only."
}
```

## If it works → GATE PASSED
- This exact `grade()` function goes straight into your Express `POST /grade` route (Step 2).
- The category rules in `gradingRequirements.js` also drive the frontend capture form ("for a phone, ask IMEI + bill; for shoes, ask sole photos").

## If it fails
Almost always: model access not enabled, wrong `BEDROCK_MODEL_ID` for your region, or missing IAM permission. The script prints the fix. Fallback if AWS access stalls: call the Anthropic API directly (same Claude model) and swap it back to Bedrock later.