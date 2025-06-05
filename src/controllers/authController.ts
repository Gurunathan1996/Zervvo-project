import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { plainToClass } from 'class-transformer';
import { ApplicationError } from '../error/invalid-request-exception';
import { UnhandledException } from '../error/unhandled-exception';
import { LoginUserDto, RegisterUserDto } from '../dtos/auth.dto';

/**
 * Controller function to handle user registration requests.
 * It calls the authService to perform the registration and sends the appropriate HTTP response.
 * @param req The Express request object.
 * @param res The Express response object.
 */
export const register = async (
  request: Request, 
  response: Response
): Promise<void> => {
  try {
    const reqBody = plainToClass(RegisterUserDto, request.body);
    const newUser = await authService.registerUser(reqBody);
    response.status(201).json({
      message: 'User registered successfully',
      user: newUser,
    });
  } catch (error: any) {
    if (error instanceof ApplicationError) {
      response.status(error.httpCode).json({
        message: error.message,
        code: error.code,
        details: error.details,
      });
    } else {
      const unhandledError = new UnhandledException(error);
      response.status(unhandledError.httpCode).json({
        message: unhandledError.message,
        code: unhandledError.code,
        details: unhandledError.details,
      });
    }
  }
};

/**
 * Controller function to handle user login requests.
 * It calls the authService to authenticate the user and sends the JWT token.
 * @param req The Express request object.
 * @param res The Express response object.
 */
export const login = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const reqBody = plainToClass(LoginUserDto, request.body);
    const { token, user } = await authService.loginUser(reqBody);
    response.status(200).json({
      message: 'Logged in successfully',
      token: token,
      user: user,
    });
  } catch (error: any) {
    if (error instanceof ApplicationError) {
      response.status(error.httpCode).json({
        message: error.message,
        code: error.code,
        details: error.details,
      });
    } else {
      const unhandledError = new UnhandledException(error);
      response.status(unhandledError.httpCode).json({
        message: unhandledError.message,
        code: unhandledError.code,
        details: unhandledError.details,
      });
    }
  }
};
