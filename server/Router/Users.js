import express from 'express';
import dotenv from 'dotenv';
import auth from '../middlewares/auth.js';
import UserController from '../controllers/UserC.js';
dotenv.config()

const uR = express.Router();

const uC = new UserController();

uR.post("/home", auth,  uC.updateLocation);
uR.get("/home", auth, uC.getHome);
uR.get("/", auth, uC.getAll);
uR.post("/friend/:id", auth, uC.sendFriendRequest);
uR.delete("/friend/:id", auth, uC.removeFriend);
uR.post("/friend/accept/:id", auth, uC.acceptFriendRequest);
uR.post("/chat", uC.addChatHistory);
uR.post("/get/chat", uC.getChatHistory);

export default uR;