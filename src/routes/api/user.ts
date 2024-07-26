import express from 'express';
import { login, signup, verifyrole, verifyuser } from '../../controller/user/user';
import verify from '../../authorization/middelware/jwtmiddelware';

const users: express.Router = express.Router();

users.get('/login',login);
users.post('/signup',signup);
users.post('/verify',verify,verifyuser);
users.post('/role',verify, verifyrole)


export default users;