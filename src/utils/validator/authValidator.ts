import { check } from 'express-validator';
import { validatorMiddleware } from '../../authorization/middelware/validatormiddelware';
import slugify from 'slugify';
import { User } from '../../model/user';

const userobject = new User();

export const signupValidator = [
  check('username')
    .notEmpty()
    .withMessage('username required field')
    .isLength({ min: 5 })
    .withMessage('username must be at least 5 chars')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('role')
    .notEmpty()
    .withMessage('role required')
    .custom(async (value, { req }) => {
      if (value == 'Role' || value == 'المستخدم') {
        throw new Error('role mustnt be empty');
      }
      return true;
    }),


  check('phone')
    .optional()
    .isMobilePhone('ar-EG')
    .withMessage('accept only Egypt phone numbers')
    .custom(async (_val, { req }) => {
      const existphone = await userobject.phoneExists(req.body.phone);
      if (existphone) {
        throw new Error("Phone Exist")
      }
      return true;
    }),

  check('email')
    .notEmpty()
    .withMessage('Email required field')
    .isEmail()
    .withMessage('Invalid email')
    .custom(async (_val, { req }) => {
      const existemail = await userobject.emailExists(req.body.email);
      if (existemail) {
        throw new Error('Email exist');
      }
      return true;
    }),

  check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 chars'),

  check('confirmPassword')
    .notEmpty()
    .withMessage('passwordConfirm is required field')
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error('Repeat Password');
      }
      return true;
    }),

  check('city')
    .notEmpty()
    .withMessage('city required')
    .custom(async (value, { req }) => {
      if (value == 'city'||value == 'المدينة') {
        throw new Error('city mustnt be empty');
      }
      return true;
    }),

  validatorMiddleware
];

export const loginValidator = [

  check('email').isEmail()
  .withMessage('Invalid email format'),

  check('password')
  .isLength({ min: 8 })
  .withMessage('password must be at least 8 chars'),
  validatorMiddleware
];

export const forgetPasswordValidator = [
  check('email')
    .isEmail()
    .withMessage('Invalid email')
    .custom(async (_val, { req }) => {
      const existemail = await userobject.emailExists(req.body.email);
      if (!existemail) {
        throw new Error('Email doesnt exist');
      }
      return true;
    }),

  validatorMiddleware
];

export const verifyPasswordValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email shouldnt be empty')
    .isEmail()
    .withMessage('Invalid email')
    .custom(async (_val, { req }) => {
      const existemail = await userobject.emailExists(req.body.email);
      if (!existemail) {
        throw new Error('Email doesnt exist');
      }
      return true;
    }),
  check('resetCode')
    .notEmpty()
    .withMessage('Code shouldnt be empty')
    .isInt()
    .withMessage('Only allowed numbers')
    .isLength({ min: 6 })
    .withMessage('Code shouldnt be less than 6 digs'),

  validatorMiddleware
];

export const resetPasswordValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email required field')
    .isEmail()
    .withMessage('Enter vaild email')
    .custom(async (_val, { req }) => {
      const existemail = await userobject.emailExists(req.body.email);
      if (!existemail) {
        throw new Error('Email doent exist');
      }
      return true;
    }),

  check('newpassword')
    .notEmpty()
    .withMessage('password required')
    .isLength({ min: 8 })
    .withMessage('Password shouldnt be lass than 8'),

  check('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password shouldnt be empty')
    .custom((val, { req }) => {
      if (val !== req.body.newpassword) {
        throw new Error('Confirm password');
      }
      return true;
    }),

  validatorMiddleware
];
