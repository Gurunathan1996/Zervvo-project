import { ApplicationError } from './invalid-request-exception';

/**
 * Error for unhandled exceptions (server-side errors not explicitly caught).
 */
export class UnhandledException extends ApplicationError {
  constructor(originalError: any) {
    super(
      'An unexpected server error occurred.',
      500,
      'UNHANDLED_EXCEPTION',
      originalError instanceof Error ? originalError.message : String(originalError)
    );
    console.error('Unhandled Exception Details:', originalError);
  }
}
