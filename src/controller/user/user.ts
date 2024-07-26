import { Request, Response } from 'express';
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
    };
}

const cipher = new Cipher()

export const signup = async (req: SignupRequest, res: Response): Promise<Response> => {
    const { email, password,name,phone, address, role } = req.body;

    // Basic validation
    if (!email || !password || !name || !phone || !address || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if the user already exists
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await cipher.encrypt(password)

        // Create a new user
        const newUser = new Users({
            email,
            password: hashedPassword,
            name,
            phone,
            address,
            role,
            wishlist: []  // Assuming wishlist is an array, initialize it
        });

        // Save the user to the database
        await newUser.save();

        // Generate a JWT token
        const token = await generatetoken(newUser.id)
        console.log(token,'omsna')
        return res.status(201).json({
            user: {
                _id: newUser._id,
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
        return res.status(500).json({ message: e});
    }
}

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
            user: {
                _id: user._id,
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
        return res.status(400).json({ message: e });
    }
}

export const verifyuser = async (req: VerifyUserRequest, res: Response): Promise<Response> => {
    const { id } = req.body;
    try {
        const user = await Users.findById(id, { password: 0 });
        // @ts-ignore
        return res.status(200).json({ ...user?._doc });
    } catch (e) {
        return res.status(404).json({ message: "User not found" });
    }
}

export const verifyrole = async (req: VerifyRoleRequest, res: Response): Promise<Response> => {
    try {
        const { id, role } = req.body;

        const user = await Users.findById(id, { password: 0 });

        if (!user)
            return res.status(404).json({ message: `User ${id} was not found` });

        if (role !== user.role)
            return res.status(401).json({ message: "Unauthorized user" });

        return res.status(200).json({ user });
    } catch (e) {
        return res.status(400).json({ message: e });
    }
}
