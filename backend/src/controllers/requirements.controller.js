// src/controllers/requirements.controller.js
import * as geminiService from "../services/gemini.service.js";

/**
 * Controller to fetch capture requirements for a product category.
 */
export async function getCategoryRequirements(req, res, next) {
  try {
    const { category } = req.query;
    if (!category) {
      return res.status(400).json({ error: "category query param is required" });
    }

    const requirements = await geminiService.getRequirements(category);
    res.json({
      success: true,
      requirements,
    });
  } catch (err) {
    next(err);
  }
}
