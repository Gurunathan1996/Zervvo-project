import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

/**
 * Middleware to validate JWT token from request header.
 * If valid, decodes the token and attaches user information to req.user.
 * If invalid or missing, sends a 401 Unauthorized response.
 */
const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
      username: string;
      email: string;
      role: string;
    };
    req.user = decoded;
    next();
  } catch (error: any) {
    console.error('JWT verification error:', error.message);
    return res.status(403).json({ message: 'Access Denied: Invalid or expired token' });
  }
};

export default authenticateToken;
