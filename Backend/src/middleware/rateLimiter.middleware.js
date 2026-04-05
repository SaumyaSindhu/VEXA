import rateLimit, { ipKeyGenerator } from "express-rate-limit";

// General limiter
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // max 100 requests
  skip: (req) => req.path === "/", // skip rate limiting for health check
  message: {
    message: "Too many requests, please try again later",
    success: false,
  },
});

// Strict limiter for AI routes
export const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  max: 10, // only 10 AI calls per minute
  keyGenerator: (req, res) => req.user?.id || ipKeyGenerator(req, res), // rate limit by user ID if logged in, otherwise by IP (search in detail why we do this) properly handles IPv6
  message: {
    message: "Too many AI requests, slow down",
    success: false,
  },
});
