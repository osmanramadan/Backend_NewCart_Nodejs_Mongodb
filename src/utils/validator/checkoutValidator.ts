import { check, query } from 'express-validator';
import { validatorMiddleware } from '../../authorization/middelware/validatormiddelware';

export const chechoutcreateorderValidator = [

  check('amount')
    .notEmpty()
    .withMessage('amount required field')
    .isNumeric()
    .withMessage('amount must be num')
    .custom((_val, { req }) => {
      return true;
    }),

  validatorMiddleware
]


export const chechoutcaptureorderValidator = [
    query('sessionid')
      .notEmpty()
      .withMessage('Session ID is a required field')
      .custom((_val, { req }) => {
        return true;
      }),
    
    validatorMiddleware
  ];