import express from "express";
import { getUsers, login, register,Logout } from "../controllers/users.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { refreshToken } from "../controllers/refreshToken.js";
const router = express.Router();

//siswa
router.get('/users',verifyToken,getUsers);
router.post('/users',register);
router.post('/login',login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);




export default router;
