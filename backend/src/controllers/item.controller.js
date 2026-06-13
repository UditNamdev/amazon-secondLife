// src/controllers/item.controller.js
import * as dynamoService from "../services/dynamo.service.js";
 
/**
 * Controller to fetch return item by ID.
 */
export async function getItemById(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Item ID is required" });
    }
 
    const item = await dynamoService.getItem(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
 
    res.json({
      success: true,
      item,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Controller to update return item by ID.
 */
export async function updateItemById(req, res, next) {
  try {
    const { id } = req.params;
    const { status, disposition, extraCredits, co2Saved, dispositionMatch } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: "Item ID is required" });
    }

    const item = await dynamoService.getItem(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Modify fields
    if (status !== undefined) item.status = status;
    if (disposition !== undefined) {
      if (!item.grade) item.grade = {};
      item.grade.disposition = disposition;
    }
    if (extraCredits !== undefined) item.extraCredits = extraCredits;
    if (co2Saved !== undefined) item.co2Saved = co2Saved;
    if (dispositionMatch !== undefined) item.dispositionMatch = dispositionMatch;

    await dynamoService.saveItem(item);

    res.json({
      success: true,
      item,
    });
  } catch (err) {
    next(err);
  }
}
