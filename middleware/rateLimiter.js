import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100000, // limit each IP to 100000 requests
  standardHeaders: true,
  legacyHeaders: false,
});

export default limiter;
