import logger from "../logger/logger.js";
const rateLimit = 20; // Max requests per minute
const interval = 60 * 1000; // Time window in milliseconds (1 minute)

const requestCounts = {};

setInterval(() => {
  Object.keys(requestCounts).forEach((ip) => {
    requestCounts[ip] = 0; // Reset request count for each IP address
  });
}, interval);

const rateLimitAndTimeout = async (req, res, next) => {
  const ip = req.ip;
  requestCounts[ip] = (requestCounts[ip] || 0) + 1;

  if (requestCounts[ip] > rateLimit) {
    logger.warn(` ip ${ip}  Rate limit exceeded`);
    return res.status(429).json({ error: "Rate limit exceeded." });
  }

  req.setTimeout(15000, () => {
    // Handle timeout error
    res.status(504).json({
        error: "requete timeout.",
    });
    req.abort(); // Abort the request
  });

  next();
};

export default rateLimitAndTimeout;
