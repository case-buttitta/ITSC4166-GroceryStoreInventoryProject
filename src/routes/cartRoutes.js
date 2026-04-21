import express from 'express';
import {
  getCartHandler,
  addCartItemHandler,
  updateCartItemHandler,
  clearCartHandler,
} from '../controllers/cartController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.get('/', authenticate, getCartHandler);
router.post('/items', authenticate, addCartItemHandler);
router.patch('/items/:product_id', authenticate, updateCartItemHandler);
router.delete('/', authenticate, clearCartHandler);

export default router;
