import mongoose from "mongoose";

const {Schema} = mongoose;

const ShippingSchema = new Schema({
    order_id:{type:String, unique: true, required: true},
    total: Number,
    address: {
        country: String,
        city: String,
        street: String,
        apartment: String
    },
    status: {type: String, enum:['CREATED','SHIPPED','DELIVERED','RETURNED'], default: "CREATED"},
    ordered_at: Date
});

const Shipping = mongoose.model('Shipping', ShippingSchema);
export default Shipping;