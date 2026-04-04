import rateLimit from "express-rate-limit";

// General limiter
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // max 100 requests
  message: {
    message: "Too many requests, please try again later",
    success: false,
  },
});

// Strict limiter for AI routes
export const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  max: 10, // only 10 AI calls per minute
  keyGenerator: (req) => req.user?.id || req.ip, // rate limit by user ID if logged in, otherwise by IP (search in detail why we do this)
  message: {
    message: "Too many AI requests, slow down",
    success: false,
  },
});
