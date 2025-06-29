import express from 'express';
import * as productController from '../controllers/product.controller.js';
import { catchError } from '../utils/catchError.js';

export const router = express.Router();

router.get('/', catchError(productController.get));
router.get('/:id', catchError(productController.get));
router.post('/', catchError(productController.create));
router.patch('/:id', catchError(productController.update));
router.delete('/:id', catchError(productController.remove));