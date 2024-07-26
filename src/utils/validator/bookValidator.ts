import {  param } from 'express-validator';
import { validatorMiddleware } from '../../authorization/middelware/validatormiddelware';

export const bookValidator = [

  param('id')
    .notEmpty()
    .withMessage('id required field')
    .isNumeric()
    .withMessage('id must be num')
    .custom((_val, { req }) => {
      return true;
    }),

  validatorMiddleware
]

