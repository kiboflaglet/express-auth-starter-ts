import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: any
}

export const requireAuth = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({message: "invalid token"})
    }

    const token = header.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded;
        next()
    } catch (error) {
        return res.status(401).json({message: "invalid token"})
    }
}