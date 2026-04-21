import express from 'express';
import {
  getAllOrdersHandler,
  getOrderByIdHandler,
  createOrderHandler,
  updateOrderStatusHandler,
  deleteOrderHandler,
} from '../controllers/orderController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';

const router = express.Router();

router.get('/', authenticate, authorizeRoles('admin'), getAllOrdersHandler);
router.get('/:id', authenticate, getOrderByIdHandler);
router.post('/', authenticate, createOrderHandler);
router.patch('/:id', authenticate, authorizeRoles('admin'), updateOrderStatusHandler);
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteOrderHandler);

export default router;
