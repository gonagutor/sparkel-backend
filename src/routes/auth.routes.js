import { Router } from 'express';
import {
  login, register, registerElevatedUser, generateInviteCode,
} from '../controllers/auth.controller';
import { isAdmin, isUser, isValidated } from '../middlewares/checkRoles';
import isLoggedIn from '../middlewares/logedInCheck';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/register/elevated', [isLoggedIn, isValidated, isAdmin], registerElevatedUser);
router.get('/newcode', [isLoggedIn, isUser, isValidated], generateInviteCode);

export default router;
