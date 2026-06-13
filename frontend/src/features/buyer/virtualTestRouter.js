// frontend/src/features/buyer/virtualTestRouter.js

/**
 * Route test types to their respective calibration and instructional datasets.
 * @param {string} testType 
 * @returns {object}
 */
export function getVirtualTestDetails(testType) {
  switch (testType) {
    case "A4_SPATIAL_SCAN":
      return {
        type: "A4_SPATIAL_SCAN",
        title: "A4 Spatial Sizing Scan",
        referenceObject: "A4 Paper (21.0 x 29.7 cm)",
        scalarCm: 29.7,
        instruction: "Place your right foot flat on a white sheet of A4 paper on the floor. Maintain the camera at a 45-degree angle.",
        helpText: "Position foot outline inside the dotted bounds. Calibrating depth via standard A4 sheet edges.",
        statusAlert: "Detecting foot margins & A4 sheet alignment...",
        calibrationSuccessMessage: "Alignment detected! Standard A4 boundary confirmed. Calculated size: 7.5 (Fits Perfectly).",
        recommendedSpecs: { size: "7.5" }
      };

    case "FACE_MESH_SCAN":
      return {
        type: "FACE_MESH_SCAN",
        title: "Face Mesh Sizing Scan",
        referenceObject: "Standard Credit Card (8.56 cm width)",
        scalarCm: 8.56,
        instruction: "Hold a standard plastic card flat against your forehead. Align your eyes with the grid markers.",
        helpText: "Position your head inside the face box and card reference to calculate precise face width.",
        statusAlert: "Detecting face landmarks & card width...",
        calibrationSuccessMessage: "Face landmarks calibrated. Facial width: 14.2cm. Recommended size: M.",
        recommendedSpecs: { size: "M" }
      };

    case "ROOM_CLEARANCE_SCAN":
      return {
        type: "ROOM_CLEARANCE_SCAN",
        title: "Room Clearance & Cabinet Scan",
        referenceObject: "Standard Doorway (90 cm width)",
        scalarCm: 90.0,
        instruction: "Scan the room. Calibrate depth relative to the nearest doorway, then position the blender 3D box under your cabinet.",
        helpText: "Point camera at the kitchen counter. Checking height clearance (45cm) against upper cabinets.",
        statusAlert: "Scanning spatial depth grid...",
        calibrationSuccessMessage: "Cabinet height verified: 52cm clearance. Fits perfectly on counter.",
        recommendedSpecs: { cleared: "true" }
      };

    default:
      return {
        type: "NONE",
        title: "Manual Sizing Chart",
        referenceObject: "Standard Metric Tape",
        scalarCm: 0,
        instruction: "Please refer to the standard size guidelines below to select the best option.",
        helpText: "No camera tools required.",
        statusAlert: "Displaying sizing table...",
        calibrationSuccessMessage: "Size selected.",
        recommendedSpecs: {}
      };
  }
}
