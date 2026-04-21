import express from 'express';
import {
  getAllProductsHandler,
  getProductByIdHandler,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
} from '../controllers/productController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import { optionalAuthenticate } from '../middleware/optionalAuthenticate.js';

const router = express.Router();

router.get('/', optionalAuthenticate, getAllProductsHandler);
router.get('/:id', optionalAuthenticate, getProductByIdHandler);
router.post('/', authenticate, authorizeRoles('admin'), createProductHandler);
router.patch('/:id', authenticate, authorizeRoles('admin'), updateProductHandler);
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteProductHandler);

export default router;
