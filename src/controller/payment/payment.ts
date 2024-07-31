import {WEBSITE_BASE_URL} from "../api/url"
import Stripe from "stripe";
import generateId from "../../utils/generateid";
import { Request, Response } from 'express';
import Session from "../../model/session";
import { Metadata } from "../../types/payment";
import { createorder } from "../order/order";



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

interface Address {
    country: string;
    city: string;
    street: string;
    apartment: string;
}


/**
 * Create checkout link for payment
 * Data of products
 * @param req.body.products.name
 * @param req.body.products.product_id
 * @param req.body.products.quantity
 * @param req.body.products.price

 * @param req.body.data.name.first
 * @param req.body.data.name.last
 * @param req.body.data.phone_number
 * @param req.body.data.email
 * @param req.body.data.address.country
 * @param req.body.data.address.city
 * @param req.body.data.address.street
 * @param req.body.data.address.apartment
 */



export const createcheckoutsession = async (req: Request, res: Response) => {
    try {
        const { data, products } = req.body;
        const order_id = generateId()+Date.now();
        let total: number = 0;


        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: products.map((product: any) => {
                total += product.price * product.quantity;
                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: product.name,
                        },
                        unit_amount: product.price * 100,
                    },
                    quantity: product.quantity || 1,
                };
            }),
            payment_intent_data: {
                metadata: {
                    order_id: order_id,
                    first_name: data.name.first,
                    last_name: data.name.last,
                    email: data.email,
                    phone_number: data.phone_number,
                    address: JSON.stringify({
                        country: data.address.country,
                        city: data.address.city,
                        street: data.address.street,
                        apartment: data.address.apartment,
                    }),
                    products: JSON.stringify(
                        products.map((product: any) => ({
                            product_id: product.product_id,
                            name: product.name,
                            quantity: product.quantity,
                        }))
                    ),
                    total: total.toFixed(2),
                },
            },
            success_url: `${WEBSITE_BASE_URL}/checkout/success?order=${order_id}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${WEBSITE_BASE_URL}/cart`,
        });


        return res.status(200).json({ status: "success", url: session.url });

    } catch (error) {
        const err = error as Error;
        return res.status(400).json({ status: "fail", message: err.message });
    }
};

/**
 * capture payment 
 *
 * @param req.query.sessionid
 */
export const capturepaymentstripe = async (req: Request, res: Response) => {
    try {
        const sessionId = req.query.sessionid as string;

        const existingSession = await Session.findOne({ session_id: sessionId });

        if (existingSession) {
            return res.status(400).json({ status: "fail", message: "Session already exists" });
        }

      
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['payment_intent.payment_method']
        });

        const paymentIntent = session.payment_intent as Stripe.PaymentIntent;

       
        const metadata = paymentIntent.metadata as unknown as Metadata;

        if (session.payment_status === 'paid') {
           
            await new Session({
                order_id: metadata.order_id,
                session_id: sessionId,
            }).save();

            req.body.data = {
                order_id: metadata.order_id,
                name:{
                    first:metadata.first_name,
                    last:metadata.last_name
                },
                email: metadata.email,
                phone_number: metadata.phone_number,
                address: JSON.parse(metadata.address as unknown as string),
                total: metadata.total,
                products:JSON.parse(metadata.products as unknown as string)
            };

            await createorder(req,res)
            
        } else {
            return res.status(400).json({ status: "fail", message: "Session not completed or already used." });
        }
    } catch (err) {
        return res.status(400).json({ status: "fail", message: (err as Error).message });
    }
};


