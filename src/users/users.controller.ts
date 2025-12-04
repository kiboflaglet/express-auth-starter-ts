import { Request, Response } from "express";
import { userService } from "./users.service";

export const userController = {
    getAllUsers: async (req: Request, res: Response) => {
        try {
            const data = await userService.getAllUsers()
            res.json(data)
        } catch (error) {
            res.status(500).json({message: "Server error"})
        }
    }
}