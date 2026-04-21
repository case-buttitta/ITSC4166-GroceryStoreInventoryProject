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
import {
  validateProductId,
  validateCreateProduct,
  validateUpdateProduct,
} from '../middleware/productValidators.js';

const router = express.Router();

router.get('/', optionalAuthenticate, getAllProductsHandler);
router.get('/:id', optionalAuthenticate, validateProductId, getProductByIdHandler);
router.post('/', authenticate, authorizeRoles('admin'), validateCreateProduct, createProductHandler);
router.patch('/:id', authenticate, authorizeRoles('admin'), validateUpdateProduct, updateProductHandler);
router.delete('/:id', authenticate, authorizeRoles('admin'), validateProductId, deleteProductHandler);

export default router;
