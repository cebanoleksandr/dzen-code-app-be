import express from 'express';
import * as orderController from '../controllers/order.controller.js';
import { catchError } from '../utils/catchError.js';

export const router = express.Router();

router.get('/', catchError(orderController.get));
router.get('/:id', catchError(orderController.getOne));
router.post('/', catchError(orderController.create));
router.patch('/:id', catchError(orderController.update));
router.delete('/:id', catchError(orderController.remove));
