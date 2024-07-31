import mongoose, { Schema, Document, Model } from 'mongoose';

interface IProduct extends Document {
    product_id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    color: string[];
    size: string[];
    image: string;
    stock: number;
    flashsales: boolean;
    discount: number;
    offer: boolean;
}

interface IProductModel extends Model<IProduct> {
    getNextProductId(): Promise<number>;
}

const productSchema = new Schema<IProduct>({
    product_id: { type: Number, unique: true },
    name: { type: String },
    description: { type: String },
    price: { type: Number },
    category: { type: String },
    color: { type: [String] },
    size: { type: [String] },
    image: {
        type: String,
        default: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco,dpr_1/lqcm8z8qwhi42efm2lue'
    },
    stock: { type: Number, default: 0 },
    flashsales: { type: Boolean, default: false },
    discount: { type: Number, default: 0 },
    offer: { type: Boolean, default: false }
});

// Static method to get the next product_id
productSchema.statics.getNextProductId = async function (): Promise<number> {
    try {
        const latestProduct = await this.findOne({}, {}, { sort: { product_id: -1 } });
        const lastId = latestProduct ? latestProduct.product_id : 0;
        return lastId + 1;
    } catch (error) {
        //@ts-ignore
        throw new Error('Failed to get the next product_id: ' + error.message);
    }
};

// Pre-save middleware to set the product_id field
productSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            //@ts-ignore
            const nextProductId = await this.constructor.getNextProductId();
            if (nextProductId == null || isNaN(nextProductId)) {
                throw new Error('Failed to generate a valid product_id.');
            }
            this.product_id = nextProductId;
        } catch (error) {
            const err =error as Error
            return next(err);
        }
    }
    next();
});

const Products = mongoose.model<IProduct, IProductModel>('Products', productSchema);
export default Products;



// import mongoose from "mongoose";
// const {Schema} = mongoose;

// const productSchema = new Schema({
//     product_id: {type: String, unique:true},
//     name: String,
//     description:String,   
//     price: Number,
//     category:String,
//     color:[],
//     size:[],
//     image:
//     {
//         type: String,
//         default: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco,dpr_1/lqcm8z8qwhi42efm2lue'
//     },
//     stock: {
//         type: Number,
//         default: 0
//     },
//     flashsales:{type: Boolean,default:false},
//     discount:{type:Number,default:0},
//     offer:{type:Boolean,default:false}
// });

// const Products = mongoose.model('Products',productSchema);
// export default Products;
