import { check, param } from 'express-validator';
import { validatorMiddleware } from '../../authorization/middelware/validatormiddelware';

export const createmessageValidator = [
  check('name')
    .notEmpty()
    .withMessage('Name required field')
    .custom((_val, { req }) => {
      return true;
    }),

  check('phone')
    .notEmpty()
    .withMessage('Phone is a required field')
    .custom(async (value, { req }) => {
      const egyptianPhoneRegex = /^01[0-9]{9}$/;
      if (!egyptianPhoneRegex.test(value)) {
        throw new Error('Invalid Egyptian phone number');
      }
      return true;
    }),

  check('email')
    .notEmpty()
    .withMessage('Email required field')
    .isEmail()
    .withMessage('Not Valid Email')
    .custom(async (_val, { req }) => {
      return true;
    }),

  check('message')
    .notEmpty()
    .withMessage('Message required field')
    .custom(async (_val, { req }) => {
      return true;
    }),

  check('user_id')
    .notEmpty()
    .withMessage('Userid required field')
    .isNumeric()
    .withMessage('user id must be num')
    .custom(async (_val, { req }) => {
      return true;
    }),

  validatorMiddleware
];

export const deleteValidator = [
  param('id')
  .notEmpty()
  .withMessage('id required field')
  .isNumeric()
  .withMessage('id must be num')
  .custom(async (_val, { req }) => {
    return true;
  }),
  validatorMiddleware
]