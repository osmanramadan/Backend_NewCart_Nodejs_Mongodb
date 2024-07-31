import { Request, Response } from 'express';
import Products from '../../model/products';
import Pagination from '../../utils/pagination';
import { orderProduct, product } from '../../types/product';
import generatetoken from '../../authorization/signtoken';
import products from '../../routes/api/product';





/**
 * insert products
 *
 * @param {array<object>} req.body.product - an array of new product 
 */

export const insertproduct= async (req: Request, res: Response) => {
    const product:product = req.body;

    if (!product) {
      res.status(400).json({ message: 'Missing required value product' });
      return;
    }
    const newProduct = new Products(product)
    try {
      await newProduct.save();
      return res.status(201).json({"status":"success","data":newProduct});
    } catch (e) {
      
      const err = e as Error;
      return res.status(400).json({status:"fail",message: err.message });
    }
  };
  

/**
 * get product details 
 *
 * @param {params} id
 */

  export const showproductdetails = async (req: Request, res: Response): Promise<void> => {
    try {
      
      if (!req.params.id)
          res.status(400).json({ message: "Id doesn't exist" });

      const product = await Products.findOne({product_id:req.params.id})

      res.status(200).json({"status":"success", details:product});
      return;

    } catch (e) {
      
      const err = e as Error;
      res.status(400).json({status:"fail",message: err.message });
      return;
    }
  };



/**
 * get product by category
 *
 * @param {string} category 
 */

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
export const showproductsperpage = async (req: Request, res: Response) => {
    try {
      let products:product[] = [];
      const itemsPerPage = 10;

      if (req.query.page) {
        res.status(400).json({ message: 'Missing required value page num' });
        return;
      }
  
      if (req.query.category) {
        products = await showproductspercategory(req.query.category as string);
      } else {
        products = await Products.find();
      }
  
      const numberOfPages = Math.ceil(products.length / itemsPerPage);
      const currentPage = parseInt(req.query.page as string) || 1;
      products = Pagination(currentPage, products, itemsPerPage);
  
      return res.status(200).json({"status":"success", total_pages: numberOfPages,products:products });
    } catch (e) {
      
      const err = e as Error;
      return res.status(400).json({status:"fail",message: err.message });
    }
  };

  
/**
 * recommendation just for users 
 *
 * @param No inputs
 */
  export const productsrecommendations = async (_req: Request, res: Response)=> {
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
  
      return res.status(200).json({"status":"success","data":products});
    } catch (e) {
      
      const err = e as Error;
      return res.status(400).json({status:"fail",message: err.message });
    }
  };

/**
 * search for products by name 
 *
 * @param {string} req.query.search
 * @param {number} req.query.page
 */

  export const productssearch = async (req: Request, res: Response) => {
    try {
     
      const itemsPerPage = 10;

      if (req.query.search || req.query.page) {
        res.status(400).json({ message: 'Missing required value search value or page number' });
        return;
      }
      
      const searchQuery = typeof req.query.search === 'string' ? req.query.search : '';
  
    
      const products:any = await Products.find({ "name": { $regex: searchQuery, $options: "i" } }).exec();
  
      const page = parseInt(req.query.page as string, 10) || 1;
      const productsPaged:product[] = Pagination(page,products);
  
     
      const numberOfPages = Math.ceil(products.length / itemsPerPage);
  
      return res.status(200).json({"status":"success",total_pages: numberOfPages, products: productsPaged });

    } catch (e) {
      
      const err = e as Error;
      return res.status(400).json({status:"fail",message: err });
    }
  };

/**
 * update quantity of stock
 *
 * @param {Array[product]} 
 */

export const updatequantity = async (products: orderProduct[]): Promise<string> => {

  try {


    
      for (const product of products) {
        
      
          const searchedProduct = await Products.findOne({ product_id:product.product_id});
          
          if(searchedProduct?.stock == 0){
            return "stock is empty";
          }

          if(searchedProduct!.stock < product.quantity){
            return `there is no enough products in stock for "${searchedProduct!.name}"`
          }
          
          const updatedStock = searchedProduct!.stock - product.quantity;
          

          if (updatedStock >= 0) {
            await Products.findOneAndUpdate(
                  { product_id: product.product_id },
                  { stock: updatedStock }
              );
            
          }
      }
      return 'success';
  } catch (error) {
      return 'error';
  }
};

/**
 * get products by arr items numbers
 *
 * @param {Array[string]} req.body.arr
 */

export const getproductsarr = async (req:Request, res:Response) => {
    try {
        const {arr,inside} = req.body;
        

        if (!arr) {
          res.status(400).json({ message: 'Missing required values arr' });
          return;
      }

        const products = await Products.find({product_id: {$in: arr}});

        return inside==false? res.status(200).json({"status":"success",products:products}):products;
    } catch (e) {
      
      const err = e as Error;
      return res.status(400).json({status:"fail",message: err.message });
    }
}


export const getproductsfromserver = async (arr:String[]):Promise< product[] | Error> => {
  try {
    
      const products:product[] = await Products.find({productsid: {$in:arr}});
      return products
  } catch (e) {
    const err = e as string
    return Error(err)
  }
}


/**
 * Validates cart products before processing to purchasing
 *
 * @param {array<object>} req.body.cart - an array of user selected products
 */

export const validateCart = async (req:Request, res:Response) => {
  
  const { cart } = req.body;

  if (!cart) {
    res.status(400).json({ message: 'Missing required value cart items' });
    return;
  }
  let totalPrice = 0;
  const products:any = [];

  try {

      for (const cartProduct of cart) {
          

          const product = await Products.findOne({product_id:cartProduct.product_id})

          if (!product) {

              return res.status(404).json({
                  status:"fail",
                  message: `${cartProduct.name} was not found in the database`,
                  product_id: cartProduct.product_id,
                  name:cartProduct.name
              });
          }

          if (product.stock <= 0) {

              return res.status(400).json({
                  status:"fail",
                  message: `${product.name} is out of stock`,
                  product_id: product.product_id,
                  name:product.name
              });
          }

          if (product.stock < cartProduct.quantity) {

              return res.status(400).json({
                  status:"fail",
                  message: `Not enough stock for ${product.name} to complete the purchase. Requested items: ${cartProduct.quantity}`,
                  product_id: product.product_id,
                  name:product.name
              });
          }

          totalPrice += product.price * cartProduct.quantity;
          products.push({
              product_id: product.product_id,
              name: product.name,
              price: product.price,
              quantity: cartProduct.quantity
          });
      }

      totalPrice = parseFloat(totalPrice.toFixed(2));
      const token = await generatetoken('12345678',products,totalPrice as unknown as string)

      return res.status(200).json({
          status:"success",
          total: totalPrice,
          cart: products,
          token:token
      });
  } catch (e) {
      
    const err = e as Error;
    return res.status(400).json({status:"fail",message: err.message });
  }
};
