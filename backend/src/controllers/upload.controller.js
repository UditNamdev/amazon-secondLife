// src/controllers/upload.controller.js
import { randomUUID } from "node:crypto";
import * as s3Service from "../services/s3.service.js";

/**
 * Controller to generate S3 presigned PUT upload URLs.
 */
export async function getUploadUrl(req, res, next) {
  try {
    const filename = req.body.filename || req.body.fileName;
    const contentType = req.body.contentType || req.body.fileType;

    if (!filename || !contentType) {
      return res.status(400).json({ error: "fileName and fileType are required" });
    }

    const itemId = req.body.itemId || randomUUID();
    const result = await s3Service.getPresignedUploadUrl(filename, contentType, itemId);

    res.json({
      success: true,
      itemId,
      key: result.key,
      uploadUrl: result.uploadUrl,
      expiresIn: result.expiresIn,
    });
  } catch (err) {
    next(err);
  }
}
