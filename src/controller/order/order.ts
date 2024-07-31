import { Request, Response } from 'express';
import { getproductsfromserver, updatequantity } from "../product/product";
import Order from '../../model/order';
import sendEmail from '../notification/notification';
import { insertshipmentfromserver } from '../shipping/shipping';
import Pagination from '../../utils/pagination';
import { Metadata} from '../../types/payment';




/**
* @param req.body.data.order_id
* @param req.body.data.first_name
* @param req.body.data.last_name
* @param req.body.data.email
* @param req.body.data.phone_number
* @param req.body.data.address.country
* @param req.body.data.address.city
* @param req.body.data.address.street
* @param req.body.data.address.apartment
* @param req.body.data.total
* @param req.body.data.products[i].product_id
* @param req.body.data.products[i].quantity
* @param req.body.data.products[i].name
*/


export const createorder = async (req:Request,res:Response) => {
    try {

        const {data}:{data:Metadata} = req.body;

        const order = new Order({
            order_id: data.order_id,
            name:{
                first: data.name.first,
                last: data.name.last,
            },
            email: data.email,
            phone_number: data.phone_number,
            address: data.address,
            products:data.products,
            total: data.total,
        });

        await order.save();
   

        try{
        
          if(await updatequantity(data.products) === "success"){
             
             await sendEmail({email:order.email,orderid:order.order_id,subject:'confirm order',message:'Your order has been sended with orderid'})
         
             await insertshipmentfromserver({ordered_at:order.ordered_at as Date,order_id:order.order_id,total:order.total,address:order.address as string})

            
            return res.status(200).json({status:"success",metadata:data});
         }
        }catch(error){
            const  err = error as Error
            return res.status(404).json({status:"fail",error:err.message});
        }
        
    
        
    } catch (error) {
       const  err = error as Error
       return res.status(404).json({status:"fail",error:err.message});
    }
};

export const getorder = async (req:Request,res:Response) => {
    try {

        const requiredOrder = await Order.findOne({order_id: req.params.id});

        if (!requiredOrder) {

            return res.status(404).json({status:"fail",message: "Order does not exist"});

        }

        const productIds = requiredOrder.products.map(pr => pr.product_id);
  

        let products = await getproductsfromserver(productIds)
    
        //@ts-ignore
        return res.status(200).json({status:"success",order:requiredOrder._doc, products:products});
    } catch (error) {
        let err = error as Error
        return res.status(400).json({message: err.message});
    }
}

export const getallorders = async (req:Request,res:Response) => {
    try {

        
        const itemsPerPage = 10;
        const currentPage = parseInt(req.query.page as string) || 1;


        const orders = await Order.find().sort({ordered_at: -1});
        const numberOfPages = Math.ceil(orders.length / itemsPerPage);
        
        const allorders = Pagination(currentPage,orders,itemsPerPage);


        return res.status(200).json({numpages:numberOfPages,orders:allorders});
    } catch (error) {
        const e = error as Error
        res.status(404).json({message: e.message});
    }
};

export const updateorder = async (req:Request,res:Response) => {
    try {

        const orderStatus = req.body.status;
        const orderClientEmail = req.body.clientEmail;
      

        if (!['CREATED', 'PROCESSING', 'FULFILLED', 'CANCELLED'].includes(orderStatus)) {
            return res.status(400).json({status:"fail",message: "Invalid status, has to be CREATED, PROCESSING, FULFILLED, CANCELLED"});
        }

        const updatedOrder = await Order.findOneAndUpdate({"order_id": req.params.id}, {
            status: orderStatus,
        });

        if (!updatedOrder) {
            return res.status(404).json({status:"fail",message: "Order does not exist"});
        }
        updatedOrder.status = orderStatus
        await sendEmail({email:orderClientEmail,status:orderStatus,orderid:req.params.id,subject:'change order status',message:'Status of your order has been changed to'})
         
        return res.status(200).json({status:"success",orderdetails:updatedOrder});

    } catch (error) {
        const err =error as Error
        res.status(404).json({status:"fail",message: err.message});
    }
};
