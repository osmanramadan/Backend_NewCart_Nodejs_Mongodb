import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

    order_id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        first: String,
        last: String
    },
    email: {type: String, required:true},
    phone_number: {type: String, required:true},
    address: {
        country: String,
        city: String,
        street: String,
        apartment: String
    },
    ordered_at: {
        type: Date,
        default:new Date().toLocaleString('en-EG',{timeZone:'Africa/Cairo'})
    },
    status: {
        type: String,
        enum: ['CREATED', 'PROCESSING', 'FULFILLED', 'CANCELLED'],
        default: 'CREATED'
    },
    products: {type: Array , required: true},
    total: {type: Number , required: true}
});

const Order = mongoose.model('Order', orderSchema);

export default Order;