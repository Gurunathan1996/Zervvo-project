import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './config/data-source';
import authRoutes from './routes/authRoutes';
import authorRoutes from './routes/authorRoutes';
import bookRoutes from './routes/bookRoutes';
import uploadRoutes from './routes/uploadRoutes';
import authenticateToken from './middlewares/authMiddleware';
import { ApiRateLimiter } from './middlewares/rateLimitMiddleware';
import { globalErrorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes);


// Rate limiter and auth middleware for protected routes
const protectedApiRateLimit = ApiRateLimiter(1, 10);

app.use('/api/authors', authenticateToken, protectedApiRateLimit, authorRoutes);
app.use('/api/books', authenticateToken, protectedApiRateLimit, bookRoutes);
app.use('/api/upload', authenticateToken, protectedApiRateLimit, uploadRoutes);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to the Interview Backend API (TypeScript with TypeORM and redis-rate-limit)!' });
});

app.use(globalErrorHandler);

// Start server after initializing DB
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Access the API at http://localhost:${PORT}`);
    });
  })
