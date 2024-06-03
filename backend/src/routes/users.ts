import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken'; // Add this line to import the 'jsonwebtoken' package
import User from "../models/user";
import { check, validationResult } from 'express-validator'; // Add this line to import the 'check' function from 'express-validator'

const router = express.Router();



// /api/users/register
router.post("/register", [
    check("firstName", "First name is required").isString(),
    check("lastName", "Last name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password with 4 or more chars is required").isLength({ min: 4 }),
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message : errors.array() })
    }
    try {
        let user = await User.findOne({
            email: req.body.email,
        });

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        user = new User(req.body);
        await user.save();

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET_KEY as string,
            {
                expiresIn: "1d",
            }
        );

        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000,
        });
        return res.sendStatus(200);

    } catch (error) {
        console.log(error);
        res.status(500).send({ messase: "Something went wronf" });
    }
});


export default router;