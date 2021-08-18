import { Router } from 'express';
import { isValidated } from '../middlewares/checkRoles';
import isLoggedIn from '../middlewares/logedInCheck';
import isThemself from '../middlewares/checkThemself';
import { getProfile, getProfileByUsername } from '../controllers/profile.controller';

const router = Router();

router.get('/id/:id', [isLoggedIn, isValidated], getProfile);
router.put('/id/:id', [isLoggedIn, isValidated, isThemself]);

router.get('/username/:username', [isLoggedIn, isValidated], getProfileByUsername);

export default router;
