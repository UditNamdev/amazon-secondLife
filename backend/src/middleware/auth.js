// src/middleware/auth.js

/**
 * Middleware to restrict route access to specific roles.
 * Reads role from the `X-User-Role` header.
 * @param {...string} roles
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    // Read from x-role or X-User-Role (case-insensitive in express req.headers)
    const role = req.headers["x-role"] || req.headers["x-user-role"] || "seller";
    if (!roles.includes(role)) {
      return res.status(403).json({
        error: `Role "${role}" not allowed. Required: ${roles.join(", ")}`,
      });
    }
    req.userRole = role;
    next();
  };
}
