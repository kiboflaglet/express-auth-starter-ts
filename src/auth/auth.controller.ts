import { Request, Response } from "express";
import { authService } from "./auth.service";

export const authController = {
    register: async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(401).json({ message: "credentials required" })
            }

            const data = await authService.register(email, password)

            res.status(201).json(data)

        } catch (error: any) {
            console.log({error})
            res.status(500).json({ message: error.message })
        }
    },
    login: async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(401).json({ message: "credentials required" })
            }

            const data = await authService.login(email, password)

            res.status(200).json(data)

        } catch (error) {
            res.status(500).json({ message: "server error" })
        }
    }

}