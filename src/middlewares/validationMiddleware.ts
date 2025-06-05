import {
  ClassConstructor,
  instanceToPlain,
  plainToInstance
} from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import {
  InvalidRequestBodyException,
  InvalidRequestException,
  ApplicationError 
} from '../error/invalid-request-exception';
import { UnhandledException } from '../error/unhandled-exception';
import { trimSanitizer } from '../helpers/trimmer';

/**
 * Middleware for validating request body against a DTO.
 * @param classType The DTO class to validate against.
 * @param skipMissingProperties If true, properties missing from the request body will be skipped during validation.
 */
export function BodyValidationMiddleware(
  classType: ClassConstructor<unknown>,
  skipMissingProperties = false
) {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      const reqBody = plainToInstance(classType, { ...request.body });

      trimSanitizer.sanitize(reqBody);

      request.body = instanceToPlain(reqBody);

      const validationErrors = await validate(reqBody as object, {
        skipMissingProperties,
        forbidUnknownValues: true,
        whitelist: true,
      });

      if (validationErrors.length) {
        next(new InvalidRequestBodyException(validationErrors));
      } else {
        next();
      }
    } catch (e: any) {
      if (e instanceof ApplicationError) {
        next(e);
      } else {
        next(new UnhandledException(e));
      }
    }
  };
}

/**
 * Middleware for validating request query parameters against a DTO.
 * @param classType The DTO class to validate against.
 * @param skipMissingProperties If true, properties missing from the query will be skipped during validation.
 */
export function QueryValidationMiddleware(
  classType: ClassConstructor<unknown>,
  skipMissingProperties = false
) {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      const reqQuery = plainToInstance(classType, { ...request.query });

      trimSanitizer.sanitize(reqQuery);
      request.query = instanceToPlain(reqQuery);

      const validationErrors = await validate(reqQuery as object, {
        skipMissingProperties,
        forbidUnknownValues: true,
        whitelist: true,
      });

      if (validationErrors.length) {
        next(
          new InvalidRequestException(
            'Required query parameters in request are either missing or invalid',
            'INVALID_REQUEST_QUERY_PARAMETERS',
            validationErrors
          )
        );
      } else {
        next();
      }
    } catch (e: any) {
      if (e instanceof ApplicationError) {
        next(e);
      } else {
        next(new UnhandledException(e));
      }
    }
  };
}

/**
 * Middleware for validating URL parameters against a DTO.
 * @param classType The DTO class to validate against.
 * @param skipMissingProperties If true, properties missing from the URL params will be skipped during validation.
 */
export function UrlParamsValidationMiddleware(
  classType: ClassConstructor<unknown>,
  skipMissingProperties = false
) {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      const reqParams = plainToInstance(classType, { ...request.params });

      trimSanitizer.sanitize(reqParams);
      request.params = instanceToPlain(reqParams);

      const validationErrors = await validate(reqParams as object, {
        skipMissingProperties,
        forbidUnknownValues: true,
        whitelist: true,
      });

      if (validationErrors.length) {
        next(
          new InvalidRequestException(
            'Required URL parameters in request are either missing or invalid',
            'INVALID_REQUEST_URL_PARAMETERS',
            validationErrors
          )
        );
      } else {
        next();
      }
    } catch (e: any) {
      if (e instanceof ApplicationError) {
        next(e);
      } else {
        next(new UnhandledException(e));
      }
    }
  };
}
