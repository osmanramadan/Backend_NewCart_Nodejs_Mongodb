import { check, param, body } from 'express-validator';
import { validatorMiddleware } from '../../authorization/middelware/validatormiddelware';

export const addhallValidator = [

  check('name')
    .isLength({ min: 5 })
    .withMessage('username must be at least 5 chars')
    .custom((_val, { req }) => true),

  check('capacity')
    .notEmpty()
    .withMessage('Capacity required field')
    .custom((_val, { req }) => true),

    check('city')
    .notEmpty()
    .withMessage('City required')
    .custom((_val, { req }) => true),

  check('location')
    .notEmpty()
    .withMessage('Location required')
    .custom((_val, { req }) => true),

  check('price')
    .notEmpty()
    .withMessage('price required field')
    .custom((value) => {
      if (isNaN(value)) {
        throw new Error('Price must be a valid number');
      }
      return true;
    }),


  check('details')
    .notEmpty()
    .withMessage('Details required')
    .custom((_val, { req }) => true),   



  body('files.images')
    .custom((value, { req }) => {
      if (!req.files || !req.files.images) {
        throw new Error('Images required');
      }
      const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      // @ts-ignore
      images.forEach(file => {
        if (!file.mimetype.startsWith('image/')) {
          throw new Error('Only image files are allowed');
        }
      });
      return true;
    }),

    body('files.pdf')
    .custom((value, { req }) => {
      if (!req.files || !req.files.pdf) {
        throw new Error('PDF required');
      }
      const pdfs = Array.isArray(req.files.pdf) ? req.files.pdf : [req.files.pdf];
       // @ts-ignore
      pdfs.forEach(file => {
        if (file.mimetype !== 'application/pdf') {
          throw new Error('Only PDF files are allowed');
        }
        if (file.size > 1 * 1024 * 1024) {
          throw new Error('PDF size must not exceed 1 MB');
        }
      });
      return true;
    }),

  body('files.video')
    .custom((value, { req }) => {
      if (!req.files || !req.files.video) {
        throw new Error('Video required');
      }
      const videos = Array.isArray(req.files.video) ? req.files.video : [req.files.video];
       // @ts-ignore
      videos.forEach(file => {
        if (!file.mimetype.startsWith('video/')) {
          throw new Error('Only video files are allowed');
        }
        if (file.size > 10 * 1024 * 1024) {
          throw new Error('Video size must not exceed 10 MB');
        }
      });
      return true;
    }),

    check('user_id')
    .notEmpty()
    .withMessage('User id required')
    .custom((_val, { req }) => true),

  validatorMiddleware
];
  



export const getuserhallsValidator = [
  param('id')
    .notEmpty()
    .withMessage('User id required')
    .isNumeric()
    .withMessage('id must be num')
    .custom(async (val, { req }) => {
      // Add any additional custom validation logic here
      return true;
    }),

  validatorMiddleware
];


export const checkfileValidator = [
  param('filename')
    .notEmpty()
    .withMessage('filename required')
    .custom(async (val, { req }) => {
      // Add any additional custom validation logic here
      return true;
    }),

  validatorMiddleware
];

export const checkaddrateValidator = [
  check('hallid')
    .notEmpty()
    .withMessage('hallid required')
    .isNumeric()
    .withMessage('hallid must be num')
    .custom(async (val, { req }) => {
      // Add any additional custom validation logic here
      return true;
    }),
    check('userid')
    .notEmpty()
    .withMessage('userid required')
    .isNumeric()
    .withMessage('userid must be num')
    .custom(async (val, { req }) => {
      // Add any additional custom validation logic here
      return true;
    }),
    check('rate')
    .notEmpty()
    .withMessage('rate required')
    .isNumeric()
    .withMessage('rate must be num')
    .custom(async (val, { req }) => {
      // Add any additional custom validation logic here
      return true;
    }),

  validatorMiddleware
];


export const changehallstatusValidator = [
  check('id')
    .notEmpty()
    .withMessage('hallid required')
    .isNumeric()
    .withMessage('hallid must be num')
    .custom(async (val, { req }) => {
      return true;
    }),

  check('checked')
    .notEmpty()
    .withMessage('check required')
    .isBoolean()
    .withMessage('check must be boolean')
    .custom(async (val, { req }) => {
      return true;
    }),

  validatorMiddleware
];

export const checkhallcodesValidator = [
  check('id')
  .notEmpty()
  .withMessage('id required')
  .isNumeric()
  .withMessage('id must be num')
  .custom(async (val, { req }) => {
    return true;
  }),

validatorMiddleware
]

export const checkshowrateValidator = [
  check('hallid')
    .notEmpty()
    .withMessage('hallid required')
    .isNumeric()
    .withMessage('hallid must be num')
    .custom(async (val, { req }) => {
      // Add any additional custom validation logic here
      return true;
    }),
    check('userid')
    .notEmpty()
    .withMessage('userid required')
    .isNumeric()
    .withMessage('userid must be num')
    .custom(async (val, { req }) => {
      // Add any additional custom validation logic here
      return true;
    }),
    
  validatorMiddleware
];



