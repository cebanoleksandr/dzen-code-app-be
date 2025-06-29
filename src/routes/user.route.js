import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { catchError } from '../utils/catchError.js';

export const router = express.Router();

router.get('/', authMiddleware, catchError(userController.get));
router.get('/:id', authMiddleware, catchError(userController.getOne));
router.patch('/:id', authMiddleware, catchError(userController.update));
router.delete('/:id', authMiddleware, catchError(userController.remove));
router.post('/login', catchError(userController.login));
router.post('/register', catchError(userController.register));
