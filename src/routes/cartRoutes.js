import express from 'express';
import {
  getCartHandler,
  addCartItemHandler,
  updateCartItemHandler,
  clearCartHandler,
} from '../controllers/cartController.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateAddCartItem, validateUpdateCartItem } from '../middleware/cartValidators.js';

const router = express.Router();

router.get('/', authenticate, getCartHandler);
router.post('/items', authenticate, validateAddCartItem, addCartItemHandler);
router.patch('/items/:product_id', authenticate, validateUpdateCartItem, updateCartItemHandler);
router.delete('/', authenticate, clearCartHandler);

export default router;
