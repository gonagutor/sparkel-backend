import { Router } from 'express';
import {
  login,
  register,
  registerElevatedUser,
  generateInviteCode,
  validateUser,
  regenerateValidationToken,
} from '../controllers/auth.controller';
import { isAdmin, isUser, isValidated } from '../middlewares/checkRoles';
import { createAccountLimiter } from '../middlewares/rateLimiting';
import isLoggedIn from '../middlewares/logedInCheck';

const router = Router();

router.post('/login', login);
router.post('/register', [createAccountLimiter], register);
router.post('/register/elevated', [isLoggedIn, isValidated, isAdmin], registerElevatedUser);
router.get('/newcode', [isLoggedIn, isUser, isValidated], generateInviteCode);
router.get('/validate', validateUser);
router.post('/validate/regenerate', regenerateValidationToken);

export default router;
