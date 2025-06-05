import { Router, Request, Response } from 'express';
import * as bookController from '../controllers/bookController'; 
import authenticateToken from '../middlewares/authMiddleware';
import {
  BodyValidationMiddleware,
  UrlParamsValidationMiddleware,
} from '../middlewares/validationMiddleware';
import {
  CreateBookDto,
  BookIdParamsDto,
  UpdateBookBodyDto,
} from '../dtos/book.dto';

const router = Router();

/**
 * @route POST /api/books
 * @desc Create a new book
 */
router.post('/create/book',
  authenticateToken,
  BodyValidationMiddleware(CreateBookDto),
  async (req: Request, res: Response) => {
    await bookController.createBook(req, res);
  }
);

/**
 * @route GET /api/books
 * @desc Get all books with author details
 */
router.get('/get-all-books',
  authenticateToken, 
  async (req: Request, res: Response) => {
  await bookController.getAllBooks(req, res);
});

/**
 * @route GET /api/books/:id
 * @desc Get a single book by ID with author details
 */
router.get('/book/get-by-id/:id',
  authenticateToken,
  UrlParamsValidationMiddleware(BookIdParamsDto),
  async (req: Request, res: Response) => {
    await bookController.getBookById(req, res);
  }
);

/**
 * @route PUT /api/books/:id
 * @desc Update a book by ID
 */
router.put('/update/book/:id',
  authenticateToken,
  UrlParamsValidationMiddleware(BookIdParamsDto), 
  BodyValidationMiddleware(UpdateBookBodyDto, true),
  async (req: Request, res: Response) => {
    await bookController.updateBook(req, res);
  }
);

/**
 * @route DELETE /api/books/:id
 * @desc Delete a book by ID
 */
router.delete('/remove/book/:id',
  authenticateToken,
  UrlParamsValidationMiddleware(BookIdParamsDto),
  async (req: Request, res: Response) => {
    await bookController.deleteBook(req, res);
  }
);

export default router;
