import express from 'express';
import AuthController from '../controllers/AuthC.js';

const authRouter = express.Router();
const authC = new AuthController();

authRouter.post("/register", authC.register);

authRouter.post("/login", authC.login);

authRouter.post("/otp", authC.verfiyOTP);

export default authRouter;

