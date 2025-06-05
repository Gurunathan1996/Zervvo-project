import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { createClient } from 'redis'; 
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        email: string;
        role: string;
      };
    }
  }
}

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('connect', () => console.log('Redis client connected to rate limiter.'));
redisClient.on('error', (err) => console.error('Redis client error in rate limiter:', err));

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('Failed to connect Redis client for rate limiter:', error);
  }
})();


/**
 * Creates a rate limiting middleware.
 * @param windowMinutes The time window in minutes (e.g., 10 for 10 minutes).
 * @param maxRequests The maximum number of requests allowed within the window.
 * @returns An Express rate limiting middleware.
 */
export const ApiRateLimiter = (windowMinutes: number, maxRequests: number) => {
  return rateLimit({
    // Use Redis as the store for rate limiting data
    store: new RedisStore({
      sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }),
    windowMs: windowMinutes * 60 * 1000,
    max: maxRequests,
    message: 'Too many requests from this user, please try again after some time.',
    statusCode: 429,
    headers: true,

    // Key generator: IMPORTANT for user-specific rate limiting
    // This function extracts the user ID from the request (assuming authenticateToken has set req.user)
    keyGenerator: (req: Request): string => {
      // Ensure req.user and req.user.id exist. If not, fallback to IP or throw an error.
      // If authentication fails before this, the request won't even reach here due to authenticateToken.
      if (req.user && req.user.id) {
        return `rate_limit:${req.user.id}`;
      }
      // Fallback: If for some reason user ID is not available (shouldn't happen on protected routes)
      // You might want to log this or use req.ip as a fallback, but user ID is preferred.
      console.warn('Rate limiter: User ID not found on request. Falling back to IP.');
      return req.ip || 'unknown_ip';
    },

    // Handler for when the limit is exceeded
    handler: (req: Request, res: any) => {
      res.status(429).json({
        message: 'Too many requests from this user, please try again after some time.',
        code: 'TOO_MANY_REQUESTS',
      });
    },
  });
};
