// src/middleware/errorHandler.js

/**
 * Global express error handler middleware.
 */
export function errorHandler(err, req, res, next) {
  console.error("Unhandled API Error:", err);
  
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    error: message,
  });
}
