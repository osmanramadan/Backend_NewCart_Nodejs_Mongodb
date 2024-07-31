import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { product } from '../types/product';


dotenv.config();

const TOKEN_SECRET: string = process.env.JWT_SECRET_KEY as string;
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN as string;

const generatetoken = async (id?:string,products?:[],total?:string): Promise<string> => {
  const token = jwt.sign({id:id,products:products,total:total}, TOKEN_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
  return token;
};

export default generatetoken;
