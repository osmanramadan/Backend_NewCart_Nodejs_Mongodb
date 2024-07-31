import { Request, Response } from 'express';
import Shipping from '../../model/shipping';
import Pagination from '../../utils/pagination';
import { shipping } from '../../types/shipping';


/**
 * insert new shipping
 *
 * @param req.body.ordered_at
 * @param req.body.order_id
 * @param req.body.address
 * @param req.body.total
 */

export const insertshipment = async (req:Request, res:Response) => {

    const { ordered_at,order_id, address, total } = req.body;

    if (!total||!order_id||!address||!ordered_at) {
        return res.status(400).json({ message: "fields are required" });
    }


    const newShipment = new Shipping({
        total,
        ordered_at,
        address,
        order_id
    });

    try {
        await newShipment.save();
        return res.status(200).json({ status: "success", shipping: newShipment });
    } catch (e) {
        return res.status(400).json({ status: "fail", message: e });
    }
}

/**
 * insert new shipping from server
 *
 * @param { ordered_at,order_id, address, total }

 */

export const insertshipmentfromserver = async (shipment:shipping) => {

    let  order_id=shipment.order_id;
    let  total=shipment.total;
    let  address=shipment.address;
    let  ordered_at=shipment.ordered_at


    const newShipment = new Shipping({
        order_id,
        total,
        address,
        ordered_at
     
    })

    try {
        await newShipment.save();
        return {status:"success",data:newShipment}
    } catch (e) {
        return {status:"fail"}
    }
}

/**
 * get shipping by id
 *
 * @param  req.params.id /:id - id of shipment
 */

export const getshipmentbyid = async (req:Request,res:Response) => {
    
    const {id} = req.params;

    if (!id) {
        return res.status(400).json({ message: "id field is required" });
    }

    try {
        const shipment = await Shipping.findOne({"order_id": id});

        if (!shipment)
            return res.status(400).json({status:"fail",message: 'Invalid order id'});
        
        return res.status(200).json({
          status:"success",
          shipping:{
            order_id:shipment.order_id,
            total:shipment.total,
            address:shipment.address,
            status:shipment.status,
            ordered_at:shipment.ordered_at
          }
        });
    } catch (e) {
        return res.status(400).json({status:"fail",message:e});
    }

}

/**
 * get shipments for admin only
 
 * @param   req.body.id - id of user
 * @param   req.query.page
 * @param   req.query.status
 */

export const getshipments = async (req:Request,res:Response) => {
    try {
        // id of user
        const id:number= req.body.id;
        const itemsPerPage = 10;
        const currentPage = parseInt(req.query.page as string) || 1;
        let shipments;
     
        
        if (!id) {
            return res.status(400).json({ message: "id field is required" });
        }
        
        if (!currentPage) {
          return res.status(400).json({ message: "page field is required" });
        }

        if(req.query.status as string){
           // { ordered_at: -1 }: This specifies that the results should be sorted in descending order _recent first_
           shipments = await Shipping.find({status:req.query.status}).sort({ordered_at: -1});
        }else{
           shipments = await Shipping.find().sort({ordered_at: -1});
        }


        const numberOfPages = Math.ceil(shipments.length / itemsPerPage);
        const pagedShipments = Pagination(currentPage,shipments,itemsPerPage);

        return res.status(200).json({status:"success",numpages:numberOfPages,shipments:pagedShipments});
    } catch (e) {
             
      const err = e as Error;
      return res.status(400).json({status:"fail",message: err.message });
    }
}

/**
 *  update shipment for admin only
 
 * @param   req.body.id - id of user
 * @param   req.body.status
 * @param   req.body.order_id
 */

export const updateshipment = async (req:Request,res:Response) => {
    try {
        const {status,id,order_id} = req.body;
        
       
        if (!id) {
            return res.status(400).json({ message: "id of user field is required" });
        }

        if (!order_id) {
            return res.status(400).json({ message: "order_id field is required" });
        }

        if (!status) {
            return res.status(400).json({ message: "status field is required" });
        }

        // if (status !== 'CREATED' && status !== 'WAITING' && status !== 'COMPLETED' && status !== 'CANCELLED')
        if (status !== 'CREATED' && status !== 'SHIPPED' && status !== 'DELIVERED' && status !== 'RETURNED')
            return res.status(400).json({message: "Please re-type the status correctly "});


        const shipmentresponse = await Shipping.findOneAndUpdate(
            { order_id }, 
            { $set: { status } },
            { new: true } 
        );
        

        return res.status(200).json({status:"success",shipmentresponse});
    } catch (e) {
              
     const  err = e as Error;
     return res.status(400).json({status:"fail",message: err.message });
    }
}