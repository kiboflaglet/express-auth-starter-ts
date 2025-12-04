import prisma from "../lib/prisma"


export const userService = {
    getAllUsers: () => {
        return prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true
            }
        })
    }
}