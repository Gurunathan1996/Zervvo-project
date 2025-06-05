import { Request, Response } from 'express';
import * as authorService from '../services/authorService';
import { plainToClass } from 'class-transformer';
import { ApplicationError } from '../error/invalid-request-exception';
import { UnhandledException } from '../error/unhandled-exception';
import {
  CreateAuthorDto,
  AuthorIdParamsDto,
  UpdateAuthorBodyDto,
} from '../dtos/author.dto';

/**
 * Controller function to handle creating a new author.
 * @param req The Express request object.
 * @param res The Express response object.
 */
export const createAuthor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const reqBody = plainToClass(CreateAuthorDto, req.body);

    const newAuthor = await authorService.createAuthor(reqBody.name, reqBody.bio);

    res.status(201).json({
      message: 'Author created successfully',
      author: newAuthor
    });
  } catch (error: any) {
    if (error instanceof ApplicationError) {
      res.status(error.httpCode).json({
        message: error.message,
        code: error.code,
        details: error.details,
      });
    } else {
      const unhandledError = new UnhandledException(error);
      res.status(unhandledError.httpCode).json({
        message: unhandledError.message,
        code: unhandledError.code,
        details: unhandledError.details,
      });
    }
  }
};

/**
 * Controller function to handle fetching all authors.
 * @param req The Express request object.
 * @param res The Express response object.
 */
export const getAllAuthors = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {
    const allAuthors = await authorService.getAllAuthors();
    res.status(200).json({
      message: "All authors fetched successfully",
      allAuthors: allAuthors
    });

  } catch (error: any) {
    if (error instanceof ApplicationError) {
      res.status(error.httpCode).json({
        message: error.message,
        code: error.code,
        details: error.details,
      });
    } else {
      const unhandledError = new UnhandledException(error);
      res.status(unhandledError.httpCode).json({
        message: unhandledError.message,
        code: unhandledError.code,
        details: unhandledError.details,
      });
    }
  }
};

/**
 * Controller function to handle fetching a single author by ID.
 * @param req The Express request object.
 * @param res The Express response object.
 */
export const getAuthorById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const reqParams = plainToClass(AuthorIdParamsDto, req.params);
    const authorId = reqParams.id;

    const author = await authorService.getAuthorById(authorId);
    res.status(200).json({
      message: "Author details fetched successfully",
      allAuthors: author
    });
  } catch (error: any) {
    if (error instanceof ApplicationError) {
      res.status(error.httpCode).json({
        message: error.message,
        code: error.code,
        details: error.details,
      });
    } else {
      const unhandledError = new UnhandledException(error);
      res.status(unhandledError.httpCode).json({
        message: unhandledError.message,
        code: unhandledError.code,
        details: unhandledError.details,
      });
    }
  }
};

/**
 * Controller function to handle updating an author by ID.
 * @param req The Express request object.
 * @param res The Express response object.
 */
export const updateAuthor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const reqParams = plainToClass(AuthorIdParamsDto, req.params);
    const reqBody = plainToClass(UpdateAuthorBodyDto, req.body);

    const authorId = reqParams.id;
    const { name, bio } = reqBody;

    const updatedAuthor = await authorService.updateAuthor(authorId, name, bio);

    res.status(200).json({
      message: 'Author updated successfully',
      author: updatedAuthor
    });
  } catch (error: any) {
    if (error instanceof ApplicationError) {
      res.status(error.httpCode).json({
        message: error.message,
        code: error.code,
        details: error.details,
      });
    } else {
      const unhandledError = new UnhandledException(error);
      res.status(unhandledError.httpCode).json({
        message: unhandledError.message,
        code: unhandledError.code,
        details: unhandledError.details,
      });
    }
  }
};
