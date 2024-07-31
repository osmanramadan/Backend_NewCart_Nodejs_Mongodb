import express from "express";
import { getproductsarr, insertproduct, productsrecommendations, productssearch, showproductdetails, showproductsperpage, validateCart } from "../../controller/product/product";




const products: express.Router = express.Router();

products.get("/",showproductsperpage);
products.get("/:id",showproductdetails);
products.post("/",insertproduct);
products.get("/recommendations",productsrecommendations);
products.get("/search",productssearch);
products.post("/arr",getproductsarr);
products.post("/cart",validateCart);
// products.patch("/updatequantity",updatequantity);
// router.patch("/", auth, adminUpdateProducts);




export default products;
