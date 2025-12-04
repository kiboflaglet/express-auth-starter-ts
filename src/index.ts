import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import authRoutes from "./auth/auth.routes"
import userRoutes from "./users/users.routes"
import { AuthRequest, requireAuth } from './middleware/auth.middleware';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/auth', authRoutes);
app.use('/users', userRoutes)

app.get("/me", requireAuth, (req: AuthRequest, res: Response) => {
    res.json({user: req?.user})
})


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is runnning on localhost:${PORT}`)
})

