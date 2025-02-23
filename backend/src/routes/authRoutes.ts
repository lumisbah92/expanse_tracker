import express from 'express';
import { register, login, resetPassword } from '../controllers/authController';
const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/reset-password', resetPassword);

export default authRouter;