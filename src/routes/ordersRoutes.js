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
import { validateOrderId, validateUpdateOrderStatus } from '../middleware/orderValidators.js';

const router = express.Router();

router.get('/', authenticate, authorizeRoles('admin'), getAllOrdersHandler);
router.get('/:id', authenticate, validateOrderId, getOrderByIdHandler);
router.post('/', authenticate, createOrderHandler);
router.patch('/:id', authenticate, authorizeRoles('admin'), validateUpdateOrderStatus, updateOrderStatusHandler);
router.delete('/:id', authenticate, authorizeRoles('admin'), validateOrderId, deleteOrderHandler);

export default router;
