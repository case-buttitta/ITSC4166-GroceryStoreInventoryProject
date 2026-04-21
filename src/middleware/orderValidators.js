import { body, param } from 'express-validator';
import { handleValidationErrors } from './handleValidationErrors.js';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered'];

export const validateOrderId = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('ID must be a positive integer')
    .toInt(),
  handleValidationErrors,
];

export const validateUpdateOrderStatus = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('ID must be a positive integer')
    .toInt(),
  body('status')
    .exists({ values: 'falsy' })
    .withMessage('status is required')
    .bail()
    .isIn(STATUSES)
    .withMessage(`Status must be one of: ${STATUSES.join(', ')}`),
  handleValidationErrors,
];
