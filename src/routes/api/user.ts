import express from 'express';
import { login, signup, verifyrole, verifyuser } from '../../controller/user/user';
import verify from '../../authorization/middelware/jwtmiddelware';
import { getwishlist, updatewishlist } from '../../controller/user/wishlist';

const users: express.Router = express.Router();

users.get('/login',login);
users.post('/signup',signup);
users.post('/verify',verify,verifyuser);
users.post('/role',verify,verifyrole)
users.get('/wishlist/:id',verify,getwishlist)
users.patch('/wishlist',verify,updatewishlist)


export default users;