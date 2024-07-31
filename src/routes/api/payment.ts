import express from "express";
import { capturepaymentstripe, createcheckoutsession } from "../../controller/payment/payment";



const payments: express.Router = express.Router();


payments.post('/stripe',createcheckoutsession);
payments.get('/capturestripe',capturepaymentstripe);


export default payments;