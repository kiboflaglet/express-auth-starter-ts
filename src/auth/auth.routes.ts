import { Request, Response, Router } from "express";
import { IUser } from "../users/users.type";
import jwt from "jsonwebtoken";
import { users } from "../users/users.data";
import bcrypt from 'bcrypt';

const router = Router();

const generateToken = (user: IUser): string => {
    console.log(process.env.JWT_SECRET)
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
    );
};

router.post('/register', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "email or password required" });
    }

    const exists = users.find(item => item.email === email)

    if (exists) {
        return res.status(409).json({ message: "user already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user: IUser = {
        id: (users.length + 1).toString(),
        email,
        password: passwordHash,
        role: "user"
    }

    users.push(user);

    const token = generateToken(user)

    return res.status(201).json({
        user: { id: user.id, email: user.email, role: user.role },
        token
    })
})

router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "email or password required" });
    }

    const user = users.find(item => item.email === email)


    if (!user) {
        return res.status(401).json({ message: "invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
        return res.status(401).json({ message: "invalid credentials" });
    }

    const token = generateToken(user)


    return res.status(201).json({
        user: { id: user.id, email: user.email, role: user.role },
        token
    })


})

router.get("/users", (req: Request, res: Response) => {
    res.json({ data: users })
})



export default router