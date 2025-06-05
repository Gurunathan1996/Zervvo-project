import { Router, Request, Response } from 'express';
import * as authController from '../controllers/authController';
import { BodyValidationMiddleware } from '../middlewares/validationMiddleware';
import { LoginUserDto, RegisterUserDto } from '../dtos/auth.dto';

const router = Router();


router.post('/register',
  BodyValidationMiddleware(RegisterUserDto),
  async (req: Request, res: Response) => {
    await authController.register(req, res);
  }
);


router.post('/login',
  BodyValidationMiddleware(LoginUserDto), 
  async (req: Request, res: Response) => {
    await authController.login(req, res);
  }
);

export default router;
