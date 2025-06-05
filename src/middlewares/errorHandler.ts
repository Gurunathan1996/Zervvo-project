import { Request, Response, NextFunction } from 'express';
import {
  ApplicationError,
  InvalidRequestBodyException,
  InvalidRequestException 
} from '../error/invalid-request-exception';
import { UnhandledException } from '../error/unhandled-exception';

/**
 * Global error handling middleware.
 * This middleware should be placed AFTER all your routes.
 */
export const globalErrorHandler = (
  err: Error, 
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Global Error Handler caught an error:', err);

  // Handle specific custom errors first
  if (err instanceof InvalidRequestBodyException) {
    return res.status(err.httpCode).json({
      message: err.message,
      code: err.code,
      errors: err.details,
    });
  } else if (err instanceof InvalidRequestException) {
    // For errors from QueryValidationMiddleware or UrlParamsValidationMiddleware
    return res.status(err.httpCode).json({
      message: err.message,
      code: err.code,
      errors: err.details,
    });
  } else if (err instanceof ApplicationError) {
    // Catch any other custom ApplicationErrors
    return res.status(err.httpCode).json({
      message: err.message,
      code: err.code,
      details: err.details,
    });
  } else if (err instanceof UnhandledException) {
    // If an error was explicitly wrapped as UnhandledException
    return res.status(err.httpCode).json({
      message: err.message,
      code: err.code,
      details: err.details,
    });
  } else {
    return res.status(500).json({
      message: 'An unexpected server error occurred.',
      code: 'SERVER_ERROR',
    });
  }
};
