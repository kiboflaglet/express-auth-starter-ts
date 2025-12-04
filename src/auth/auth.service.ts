import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";


const generateToken = (user: { id: string, email: string, role: string }): string => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
    );
};


export const authService = {
    register: async (email: string, password: string) => {

        const exists = await prisma.user.findUnique({ where: { email } })

        if (exists) throw new Error("User already exists")

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: passwordHash
            },
            select: {
                id: true,
                email: true,
                role: true
            }
        })

        const token = generateToken(user)

        return { user, token }

    },
    login: async (email: string, password: string) => {
        const exists = await prisma.user.findUnique({ where: { email } })

        if (!exists) throw new Error("credentials failed")

        const isPasswordCorrect = await bcrypt.compare(password, exists.password);

        if (!isPasswordCorrect) throw new Error("credentials failed")

        const token = generateToken(exists)

        return { exists, token }
    },
}