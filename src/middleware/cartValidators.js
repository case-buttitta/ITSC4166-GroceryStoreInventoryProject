import { body, param } from 'express-validator';
import { handleValidationErrors } from './handleValidationErrors.js';

export const validateAddCartItem = [
  body('product_id')
    .isInt({ gt: 0 })
    .withMessage('product_id must be a positive integer')
    .toInt(),
  body('quantity')
    .isInt({ gt: 0 })
    .withMessage('quantity must be a positive integer')
    .toInt(),
  handleValidationErrors,
];

export const validateUpdateCartItem = [
  param('product_id')
    .isInt({ gt: 0 })
    .withMessage('product_id must be a positive integer')
    .toInt(),
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('quantity must be a non-negative integer')
    .toInt(),
  handleValidationErrors,
];
