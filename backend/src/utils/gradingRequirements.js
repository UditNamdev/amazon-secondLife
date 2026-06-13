// src/utils/gradingRequirements.js
// Category-aware capture + inspection rules.

export const GRADING_REQUIREMENTS = {
  electronics: {
    label: "electronics device",
    photos: 5,
    photoGuide: ["front", "back", "screen powered on", "ports & edges", "serial / IMEI label"],
    fields: ["imei", "model", "purchaseDate"], // seller-provided info
    docs: ["bill"],                            // original invoice for authenticity
    checks: ["Does it power on?"],
    inspect:
      "screen cracks or scratches, dents, body scratches, port/charging damage, " +
      "screen burn-in or dead pixels, whether it powers on, and whether the serial/IMEI " +
      "label is present and consistent with the provided IMEI."
  },

  footwear: {
    label: "pair of shoes",
    photos: 4,
    photoGuide: ["top / upper", "sole wear", "heel & back", "size label"],
    fields: ["size"],
    docs: [],
    checks: ["Approx. times worn?"],
    inspect:
      "sole wear and tread depth, creasing of the upper, scuffs, stains, sole separation, " +
      "and whether the original box is present."
  },

  clothing: {
    label: "clothing item",
    photos: 4,
    photoGuide: ["full front", "full back", "brand / size tags", "any defects close-up"],
    fields: ["size"],
    docs: [],
    checks: ["Washed?", "Tags attached?"],
    inspect:
      "stains, tears, holes, pilling, fading, stretched areas, missing buttons, " +
      "and whether original tags are still attached."
  },

  appliance: {
    label: "home appliance",
    photos: 4,
    photoGuide: ["front", "back / inputs", "model label", "accessories"],
    fields: ["model"],
    docs: [],
    checks: ["Does it power on?", "Accessories included?"],
    inspect:
      "physical damage, dents, missing accessories or parts, signs of heavy use, " +
      "and whether it powers on."
  }
};
