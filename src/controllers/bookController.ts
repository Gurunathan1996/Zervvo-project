import { Request, Response } from 'express';
import * as bookService from '../services/bookService';
import { plainToClass } from 'class-transformer';
import { ApplicationError } from '../error/invalid-request-exception';
import { UnhandledException } from '../error/unhandled-exception';
import {
  CreateBookDto,
  BookIdParamsDto,
  UpdateBookBodyDto,
} from '../dtos/book.dto';

/**
 * Controller function to handle creating a new book.
 * @param req The Express request object.
 * @param res The Express response object.
 */
export const createBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const reqBody = plainToClass(CreateBookDto, req.body);

    const newBook = await bookService.createBook(
      reqBody.title,
      reqBody.genre,
      reqBody.publicationYear,
      reqBody.authorId
    );

    res.status(201).json({
      message: 'Book created successfully',
      book: newBook
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
 * Controller function to handle fetching all books.
 * @param req The Express request object.
 * @param res The Express response object.
 */
export const getAllBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const allBooks = await bookService.getAllBooks();
    res.status(200).json({
      message: "All books details fetched successfully",
      allBooks: allBooks
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
 * Controller function to handle fetching a single book by ID.
 * @param req The Express request object.
 * @param res The Express response object.
 */
export const getBookById = async (req: Request, res: Response): Promise<void> => {
  try {
    const reqParams = plainToClass(BookIdParamsDto, req.params);
    const bookId = reqParams.id;

    const book = await bookService.getBookById(bookId);
    res.status(200).json({
      message: "books details fetched successfully",
      Book: book
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
 * Controller function to handle updating a book by ID.
 * @param req The Express request object.
 * @param res The Express response object.
 */
export const updateBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const reqParams = plainToClass(BookIdParamsDto, req.params);
    const reqBody = plainToClass(UpdateBookBodyDto, req.body);

    const bookId = reqParams.id;
    // const { title, genre, publicationYear, authorId } = reqBody;

    const updatedBook = await bookService.updateBook(bookId, reqBody)
      // title, genre, publicationYear, authorId);

    res.status(200).json({
      message: 'Book updated successfully',
      book: updatedBook
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
 * Controller function to handle deleting a book by ID.
 * @param req The Express request object.
 * @param res The Express response object.
 */
export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const reqParams = plainToClass(BookIdParamsDto, req.params);
    const bookId = reqParams.id;

    const deleted = await bookService.deleteBook(bookId);

    res.status(200).json({ message: 'Book deleted successfully' });
    
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
