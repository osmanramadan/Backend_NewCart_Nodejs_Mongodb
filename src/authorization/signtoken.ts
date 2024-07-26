import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();

const TOKEN_SECRET: string = process.env.JWT_SECRET_KEY as string;
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN as string;

const generatetoken = async (id:string): Promise<string> => {
  const token = jwt.sign({id:id }, TOKEN_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
  return token;
};

export default generatetoken;
