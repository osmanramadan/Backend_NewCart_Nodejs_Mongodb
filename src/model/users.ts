import mongoose, { Schema, Document, Model, Error } from 'mongoose';


interface User extends Document {
    
    id: number;
    name: string;
    email: string;
    password: string;
    role: 'USER' | 'ADMIN';
    phone?: string;
    address?: string;
    wishlist: string[];
}


interface UserModel extends Model<User> {
    getNextId(): Promise<number>;
}

const addressSchema = new Schema({
    first: { type: String},
    second: { type: String}
  });
  

const UsersSchema = new Schema<User>({
    id: { type: Number },
    name: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    phone: { type: String },
    address: { type: addressSchema},
    wishlist: { type: [String] }
});




UsersSchema.statics.getNextId = async function (): Promise<number> {
    const latestUser = await this.findOne({}, {}, { sort: { id: -1 } });
    return latestUser ? latestUser.id + 1 : 1;
};

UsersSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            // @ts-ignore
            this.id = await this.constructor.getNextId();
        } catch (error) {
            const err=error as Error
            return next(err);
        }
    }
    next();
});

const Users = mongoose.model<User, UserModel>('Users', UsersSchema);
export default Users;



// import mongoose from "mongoose";

// const {Schema} = mongoose;

// const UsersSchema = new Schema({
//     id:{type:Number},
//     name: {type: String},
//     email: {type: String, required: true},
//     password: {type: String, required: true},
//     role: {type: String, enum: ['USER', 'ADMIN'], default: "USER"},
//     phone: {type: String},
//     address:{type:String},
//     wishlist: {type: Array}
// });

// const Users = mongoose.model('Users', UsersSchema);
// export default Users;