import { Request, Response } from 'express';
import Users from '../../model/users';
import { getproductsarr, getproductsfromserver } from '../product/product';




/**
 * get user wishlist by its id
 *
 * @param  req.body.id
 */
export const getwishlist = async (req: Request, res: Response): Promise<Response> => {

    //@ts-ignore    
    const { id }: { id:number } = req.params;
    

    if(!id){
        return res.status(400).json({ message: 'Missing required value id' });
    }

    try {
       
        const user = await Users.findOne({id});
        if (!user) {
            return res.status(404).json({message: 'User not found' });
        }
        const { wishlist }: { wishlist: string[] } = user;

        req.body.arr=[...wishlist]
        req.body.inside = true
        let products = await getproductsarr(req,res)
        
        // const products = await getproductsfromserver(wishlist)
        // console.log(products)
         
        return res.status(200).json({status:"success",products:products});

           
    } catch (e) {
             
      const err = e as Error;
      return res.status(400).json({status:"fail",message: err.message });
    }
};


/**
 * update wishlist of user
 *
 * @param object<id,product_id> req.body.object
 */

export const updatewishlist = async (req: Request, res: Response): Promise<Response> => {
    const { id, product_id }: { id: string, product_id: string } = req.body;

    try {
        // Validate input
        if (!id || !product_id) {
            return res.status(400).json({ message: 'Missing required values' });
        }

        // Find the user by id (assuming id is a string and is used directly as a query parameter)
        const user = await Users.findOne({ id: id }); // Adjust field name if necessary
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Handle wishlist update
        const wishlist: string[] = user.wishlist || [];
        let newWishlist: string[];

        if (wishlist.includes(product_id)) {
            newWishlist = wishlist.filter((item) => item !== product_id);
        } else {
            newWishlist = [...wishlist, product_id];
        }

        // Update user document
        await Users.findOneAndUpdate({ id: id }, { wishlist: newWishlist }); // Adjust field name if necessary

        return res.status(200).json({"status":"success",wishlist: newWishlist });
    } catch (error) {
        return res.status(400).json({ message: (error as Error).message });
    }
};