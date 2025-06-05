import { Router, Request, Response } from 'express';
import * as authorController from '../controllers/authorController';
import authenticateToken from '../middlewares/authMiddleware';
import {
  BodyValidationMiddleware,
  UrlParamsValidationMiddleware,
} from '../middlewares/validationMiddleware';
import {
  CreateAuthorDto,
  AuthorIdParamsDto,
  UpdateAuthorBodyDto,
} from '../dtos/author.dto';

const router = Router();

/**
 * @route POST /api/authors
 * @desc Create a new author
 * @access Private (requires JWT)
 */
router.post('/create/author',
  authenticateToken,
  BodyValidationMiddleware(CreateAuthorDto),
  async (req: Request, res: Response) => {
    await authorController.createAuthor(req, res);
  }
);

/**
 * @route GET /api/authors
 * @desc Get all authors
 */
router.get('/all-authors',
  authenticateToken, 
  async (req: Request, res: Response) => {
  await authorController.getAllAuthors(req, res);
});

/**
 * @route GET /api/authors/:id
 * @desc Get a single author by ID
 */
router.get('/author-by-id/:id',
  UrlParamsValidationMiddleware(AuthorIdParamsDto),
  async (req: Request, res: Response) => {
    await authorController.getAuthorById(req, res);
  }
);

/**
 * @route PUT /api/authors/:id
 * @desc Update an author by ID
 * @access Private (requires JWT)
 */
router.put('/update-author/:id',
  authenticateToken,
  UrlParamsValidationMiddleware(AuthorIdParamsDto),
  BodyValidationMiddleware(UpdateAuthorBodyDto, true),
  async (req: Request, res: Response) => {
    await authorController.updateAuthor(req, res);
  }
);
export default router;
