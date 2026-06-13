// src/services/s3.service.js
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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

/**
 * Downloads a file buffer from S3.
 * @param {string} key
 * @returns {Promise<{ buffer: Buffer, contentType: string }>}
 */
export async function downloadBuffer(key) {
  const response = await s3.send(
    new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
    })
  );
  
  const byteArray = await response.Body.transformToByteArray();
  return {
    buffer: Buffer.from(byteArray),
    contentType: response.ContentType,
  };
}

/**
 * Uploads a file buffer directly to S3.
 * @param {string} key
 * @param {Buffer} buffer
 * @param {string} contentType
 */
export async function uploadBuffer(key, buffer, contentType) {
  return s3.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );
}

/**
 * Generates a presigned URL for direct browser uploads.
 * @param {string} filename
 * @param {string} contentType
 * @param {string} itemId
 * @param {number} expiresIn
 */
export async function getPresignedUploadUrl(filename, contentType, itemId, expiresIn = 300) {
  const key = `${itemId}/${filename}`;
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn });
  return {
    key,
    uploadUrl,
    expiresIn,
  };
}
