import mongoose from "mongoose";

const {Schema} = mongoose;

const UsersSchema = new Schema({
    name: {type: String},
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, enum: ['USER', 'ADMIN'], default: "USER"},
    phone: {type: String},
    address:{type:String},
    wishlist: {type: Array}
});

const Users = mongoose.model('Users', UsersSchema);
export default Users;