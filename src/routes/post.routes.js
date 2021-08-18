import { Router } from 'express';
import { isValidated } from '../middlewares/checkRoles';
import isLoggedIn from '../middlewares/logedInCheck';
import {
  addNewPost,
  deletePost,
  getMostRecentPosts,
  getPostsById,
  getPostsByIdMediaOnly,
  getPostsByIdTextOnly,
  getPostsByUsername,
  getPostsByUsernameMediaOnly,
  getPostsByUsernameTextOnly,
  getSpecificPost,
} from '../controllers/post.controller';

const router = Router();

// Get user specific posts by id
router.get('/id/all/:id', [isLoggedIn, isValidated], getPostsById);
router.get('/id/media/:id', [isLoggedIn, isValidated], getPostsByIdMediaOnly);
router.get('/id/text/:id', [isLoggedIn, isValidated], getPostsByIdTextOnly);

// Get user specific posts
router.get('/username/all/:username', [isLoggedIn, isValidated], getPostsByUsername);
router.get('/username/media/:username', [isLoggedIn, isValidated], getPostsByUsernameMediaOnly);
router.get('/username/text/:username', [isLoggedIn, isValidated], getPostsByUsernameTextOnly);

router.get('/', [isLoggedIn, isValidated], getMostRecentPosts); // Allow user to get all posts
router.post('/', [isLoggedIn, isValidated], addNewPost); // Allow user to create a new post

router.delete('/specific/:id', [isLoggedIn, isValidated], deletePost);
router.get('/specific/:id', [isLoggedIn, isValidated], getSpecificPost);

export default router;
