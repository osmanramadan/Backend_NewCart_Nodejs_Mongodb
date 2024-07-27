import express from "express";
import { getproductsarr, insertproducts, productsrecommendations, productssearch, showproductsperpage, updatequantity } from "../../controller/product/product";




const products: express.Router = express.Router();

products.get("/",showproductsperpage);
products.post("/",insertproducts);
products.get("/recommendations",productsrecommendations);
products.get("/search",productssearch);
products.post("/arr", getproductsarr);
// products.patch("/updatequantity",updatequantity);
// router.patch("/", auth, adminUpdateProducts);
// router.post("/cart", validateCart);
// 


export default products;
