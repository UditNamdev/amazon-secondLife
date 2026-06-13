// src/routes/api.routes.js
import { Router } from "express";
import multer from "multer";
import { requireRole } from "../middleware/auth.js";
import { gradeItem } from "../controllers/grade.controller.js";
import { getUploadUrl } from "../controllers/upload.controller.js";
import { getItemById, updateItemById } from "../controllers/item.controller.js";
import { getCategoryRequirements } from "../controllers/requirements.controller.js";
import { checkPurchaseRisk } from "../controllers/preventionEngine.js";

const router = Router();

// Multer memory storage configuration for multipart image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// POST /grade - Evaluate returns grade using S3 keys
router.post("/grade", requireRole("seller", "donor", "ngo", "admin"), gradeItem);

// POST /upload - Generate presigned S3 URL
router.post("/upload", requireRole("seller", "donor", "ngo", "admin"), getUploadUrl);

// GET /item/:id - Retrieve return item by ID
router.get("/item/:id", requireRole("buyer", "seller", "donor", "ngo", "admin"), getItemById);

// PUT /item/:id - Update return item by ID
router.put("/item/:id", requireRole("buyer", "seller", "donor", "ngo", "admin"), updateItemById);

// GET /requirements - Retrieve dynamic requirements list
router.get("/requirements", getCategoryRequirements);

// POST /evaluate-risk - Assess purchase risk dynamically
router.post("/evaluate-risk", requireRole("buyer", "seller", "donor", "ngo", "admin"), checkPurchaseRisk);

export default router;
