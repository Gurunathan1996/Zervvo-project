import { ValidationError } from 'class-validator';

/**
 * Base class for custom application errors.
 */
export class ApplicationError extends Error {
  public readonly name: string;
  public readonly httpCode: number;
  public readonly code: string;
  public readonly details?: any;

  constructor(
    message: string,
    httpCode: number = 500,
    code: string = 'APPLICATION_ERROR',
    details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    this.httpCode = httpCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Error for invalid request body.
 */
export class InvalidRequestBodyException extends ApplicationError {
  constructor(validationErrors: ValidationError[]) {
    super(
      'Invalid request body. Please check the provided data.',
      400,
      'INVALID_REQUEST_BODY',
      validationErrors.map(error => {
        return {
          property: error.property,
          constraints: error.constraints,
          value: error.value,
        };
      })
    );
  }
}

/**
 * Error for invalid request parameters (query or URL params).
 */
export class InvalidRequestException extends ApplicationError {
  constructor(message: string, code: string, validationErrors?: ValidationError[]) {
    super(
      message,
      400,
      code,
      validationErrors ? validationErrors.map(error => {
        return {
          property: error.property,
          constraints: error.constraints,
          value: error.value,
        };
      }) : undefined
    );
  }
}
