import { body, param } from 'express-validator';
import { handleValidationErrors } from './handleValidationErrors.js';

export const validateProductId = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('ID must be a positive integer')
    .toInt(),
  handleValidationErrors,
];

export const validateCreateProduct = [
  body('product_name')
    .exists({ values: 'falsy' })
    .withMessage('product_name is required')
    .bail()
    .isString()
    .trim(),
  body('upc')
    .exists({ values: 'falsy' })
    .withMessage('upc is required')
    .bail()
    .isString()
    .trim(),
  body('price')
    .exists({ values: 'falsy' })
    .withMessage('price is required')
    .bail()
    .isFloat({ min: 0 })
    .withMessage('price must be a non-negative number')
    .toFloat(),
  body('stock_quantity')
    .exists({ values: 'falsy' })
    .withMessage('stock_quantity is required')
    .bail()
    .isInt({ min: 0 })
    .withMessage('stock_quantity must be a non-negative integer')
    .toInt(),
  body('reorder_threshold')
    .optional()
    .isInt({ min: 0 })
    .withMessage('reorder_threshold must be a non-negative integer')
    .toInt(),
  body('warehouse_location')
    .optional()
    .isString()
    .trim(),
  handleValidationErrors,
];

const updatable_fields = ['product_name', 'upc', 'price', 'stock_quantity', 'reorder_threshold', 'warehouse_location'];

export const validateUpdateProduct = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('ID must be a positive integer')
    .toInt(),
  body('product_name').optional().isString().trim(),
  body('upc').optional().isString().trim(),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('price must be a non-negative number')
    .toFloat(),
  body('stock_quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('stock_quantity must be a non-negative integer')
    .toInt(),
  body('reorder_threshold')
    .optional()
    .isInt({ min: 0 })
    .withMessage('reorder_threshold must be a non-negative integer')
    .toInt(),
  body('warehouse_location').optional().isString().trim(),
  body().custom((_, { req }) => {
    if (!updatable_fields.some((f) => req.body[f] !== undefined)) {
      throw new Error('No valid fields provided for update');
    }
    return true;
  }),
  handleValidationErrors,
];
