import express from "express";
import { createorder, getallorders, getorder, updateorder } from "../../controller/order/order";
import verify from "../../authorization/middelware/jwtmiddelware";
import { verifyrolemiddle } from "../../controller/user/user";




const orders: express.Router = express.Router();

orders.post('/',createorder);
orders.get('/:id',getorder);
orders.get('/',verify,verifyrolemiddle,getallorders);
orders.patch('/:id',verify,verifyrolemiddle,updateorder);

export default orders;
