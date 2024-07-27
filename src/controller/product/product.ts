import { Request, Response } from 'express';
import Products from '../../model/products';
import Pagination from '../../utils/pagination';
import { product } from '../../types/product';





/**
 * insert products
 *
 * @param {array<object>} req.body - an array of new product 
 */

export const insertproducts= async (req: Request, res: Response): Promise<void> => {
    const product:product = req.body;
  
    const newProduct = new Products(product)
    try {
      await newProduct.save();
      res.status(201).json({"status":"success","data":newProduct});
    } catch (error) {
      const err = error as Error;
      res.status(409).json({ message: err.message });
    }
  };
  



const showproductspercategory = async (category: string): Promise<product[]> => {
    try {
      let products:product[] = await Products.find({ "category": { $regex: category, $options: "i" } });
      return products;
    } catch (error) {
      throw error;
    }
  }
  
  

/**
 * get products by page 
 *
 * @param {string} req.query.category 
 * @param {number} req.query.page
 */
export const showproductsperpage = async (req: Request, res: Response): Promise<void> => {
    try {
      let products:product[] = [];
      const itemsPerPage = 10;
  
      if (req.query.category) {
        products = await showproductspercategory(req.query.category as string);
      } else {
        products = await Products.find();
      }
  
      const numberOfPages = Math.ceil(products.length / itemsPerPage);
      const currentPage = parseInt(req.query.page as string) || 1;
      products = Pagination(currentPage, products, itemsPerPage);
  
      res.status(200).json({"status":"success", total_pages: numberOfPages,products:products });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message:err});
    }
  };

  
/**
 * recommendation just for users 
 *
 * @param No inputs
 */
  export const productsrecommendations = async (_req: Request, res: Response): Promise<void> => {
    try {

        let categories: { category: string }[] = await Products.aggregate([
            { $sample: { size: 2 } },
            { $project: { category: 1} }
          ]);
      
     
      while (categories.length === 2 && categories[0].category === categories[1].category) {
        categories = await Products.aggregate([
          { $sample: { size: 2 } },
          { $project: { category: 1 } }
        ]);
      }
  
      let products: product[] = [];
  
      const productscategoryone = await Products.aggregate([
        { $match: { category: categories[0]?.category } },
        { $sample: { size: 1 } },

      ]);
  
      const productscategorytwo = await Products.aggregate([
        { $match: { category: categories[1]?.category } },
        { $sample: { size: 1 } },

      ]);
       
      if (categories[0]?.category) {
        products.push(...productscategoryone);
      }
      
      if (categories[1]?.category) {
        products.push(...productscategorytwo);
      }
  
      res.status(200).json({"status":"success","data":products});
    } catch (error) {
      const err = error as Error;
      res.status(400).json({ message: err.message });
    }
  };

/**
 * search for products by name 
 *
 * @param {string} req.query.search
 * @param {number} req.query.page
 */

  export const productssearch = async (req: Request, res: Response): Promise<void> => {
    try {
     
      const itemsPerPage = 10;
      const searchQuery = typeof req.query.search === 'string' ? req.query.search : '';
  
    
      const products:any = await Products.find({ "name": { $regex: searchQuery, $options: "i" } }).exec();
  
      const page = parseInt(req.query.page as string, 10) || 1;
      const productsPaged:product[] = Pagination(page,products);
  
     
      const numberOfPages = Math.ceil(products.length / itemsPerPage);
  
      res.status(200).json({"status":"success",total_pages: numberOfPages, products: productsPaged });

    } catch (error) {
      const err = error as Error;
      res.status(404).json({ message: err.message });
    }
  };

/**
 * update quantity of stock
 *
 * @param {Array[product]} req.body
 */


  export const updatequantity = async (req:Request, res:Response) => {
    try {
        const { products } = req.body;
        for(const product of products){
            
            const searchedProduct = await Products.findOne({ product_id: product.product_id });
            // @ts-ignore
            if(searchedProduct.stock - product.quantity <= 0){

                await Products.findOneAndUpdate({product_id: product.product_id},{ "stock": 0});
            }
            else{
                // @ts-ignore
                await Products.findOneAndUpdate({product_id: product.product_id},{"stock": searchedProduct.stock - product.quantity}); 
            }
        }
        res.status(200).json({"status":"success",message: "updated" });
    } catch (error) {
        const err = error as Error
        res.status(500).json({ message: err });
    }
}



export const getproductsarr = async (req:Request, res:Response) => {
    try {
        const {arr} = req.body;

        const products = await Products.find({product_id: {$in: arr}});

        res.status(200).json({"status":"success",products:products});
    } catch (e) {
        res.status(400).json({message:e});
    }
}
