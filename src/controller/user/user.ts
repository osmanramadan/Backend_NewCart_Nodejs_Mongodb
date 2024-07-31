import { NextFunction, Request, Response } from 'express';
import Users from '../../model/users';
import Cipher from '../../authentication/bcrypt';
import generatetoken from '../../authorization/signtoken';



interface SignupRequest extends Request {
    
    body: {
        name:string;
        email: string;
        password: string;
        phone: string;
        address: string;
        role: string;
    };
}

interface LoginRequest extends Request {
    body: {
        email: string;
        password: string;
    };
}

interface VerifyUserRequest extends Request {
    body: {
        id: string;
    };
}

interface VerifyRoleRequest extends Request {
    body: {
        id: string;
        role: string;
        middleware:Boolean
    };
}

const cipher = new Cipher()


/**
 * insert new user
 *
 * @param object<email,password,name?,phone?,address<{first,second}>?,role?> req.body.object
 */

export const signup = async (req: SignupRequest, res: Response): Promise<Response> => {

    const { email, password,name,phone, address, role } = req.body;


    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {

        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await cipher.encrypt(password)

    
        const newUser = new Users({
            email,
            password: hashedPassword,
            name,
            phone,
            address,
            role,
            wishlist: []
        });

        await newUser.save();
        const token = await generatetoken(newUser._id as string)

        return res.status(201).json({
            "status":"success",
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                phone: newUser.phone,
                address: newUser.address,
                role: newUser.role,
                wishlist: newUser.wishlist
            },
            token
        });
    } catch (e) {
              
     const err = e as Error;
     return res.status(400).json({status:"fail",message: err.message });
    }
}

/**
 * access to user acount
 *
 * @param object<email,password> req.body.object
 */

export const login = async (req: LoginRequest, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    if (!email)
        return res.status(400).json({ message: "Email address is not provided" });
    if (!password)
        return res.status(400).json({ message: "Password is not provided" });

    try {
        const user = await Users.findOne({ email });

        if (!user)
            return res.status(404).json({ message: "User was not found" });

        const isPasswordCorrect = await cipher.decrypt(user.password,password)

        if (!isPasswordCorrect)
            return res.status(400).json({ message: "Wrong password" });
        // @ts-ignore
        const token =await generatetoken(user._id)

        return res.status(200).json({
            "status":"success",
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                address: user.address,
                role: user.role,
                wishlist: user.wishlist
            },
            token
        });
    } catch (e) {
              
      const err = e as Error;
      return res.status(400).json({status:"fail",message: err.message });
    }
}

/**
 * verify user info by its id
 *
 * @param  req.body.id
 */

export const verifyuser = async (req: VerifyUserRequest, res: Response): Promise<Response> => {
    const { id } = req.body;
    try {
        const user = await Users.findById(id, { password: 0 });
        // @ts-ignore
        return res.status(200).json({status:"success" , ...user?._doc });
    } catch (e) {
        return res.status(404).json({ message: "User not found" });
    }
}

/**
 * verify user role by its id,role
 *
 * @param object<id,role> req.body.object
 */

export const verifyrole = async (req: VerifyRoleRequest,res:Response) => {
    try {
        const { id, role} = req.body;
        
        if (!role || !id) {
            return res.status(400).json({ message: "All fields are required" });
        }
    

        const user = await Users.findById(id, { password: 0 });

        if (!user)
            return res.status(404).json({ message: `User ${id} was not found` });

        if (role !== user.role)
            return res.status(401).json({ message: "Unauthorized user" });
       
        return  res.status(200).json({status:"success", user })

        
    } catch (e) {
            
      const err = e as Error;
      return res.status(400).json({status:"fail",message: err.message });
    }
}



/**
 * verify user role by its id,role
 *
 * @param object<id,role> req.body.object
 */

export const verifyrolemiddle = async (req: VerifyRoleRequest,res:Response,next:NextFunction) => {
    try {
        const { id, role="ADMIN"} = req.body;
        
        if (!role || !id) {
            return res.status(400).json({ message: "All fields are required" });
        }
    

        const user = await Users.findById(id, { password: 0 });

        if (!user)
            return res.status(404).json({ message: `User ${id} was not found` });

        if (role !== user.role)
            return res.status(401).json({ message: "Unauthorized user" });
        
        next()
        
    } catch (e) {
            
      const err = e as Error;
      return res.status(400).json({status:"fail",message: err.message });
    }
}
