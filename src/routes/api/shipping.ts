import express from "express";
import { getshipmentbyid, getshipments, insertshipment, updateshipment } from "../../controller/shipping/shipping";
import verify from "../../authorization/middelware/jwtmiddelware";
import {  verifyrolemiddle } from "../../controller/user/user";


const shipping: express.Router = express.Router();


shipping.post('/',insertshipment);
shipping.get('/:id',getshipmentbyid);
shipping.get('/',verify,verifyrolemiddle,getshipments);
shipping.patch('/',verify,verifyrolemiddle,updateshipment);


export default shipping;