import express from "express";
import { getUsers, login, register,Logout, ForgotPassword, ResetPassword } from "../controllers/users.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { refreshToken, refreshTokenRegister } from "../controllers/refreshToken.js";
import { LogoutAdmin, getAdmins, loginAdmin, registerAdmin } from "../controllers/admins.js";
import { createMakanan, deleteMakanan, getMakanan, getMakananById, updateMakanan } from "../controllers/makanan/maknanan.js";
import upload from "../config/multerConfig.js";
const router = express.Router();

//user
router.get('/users',verifyToken,getUsers);
router.post('/users',register);
router.post('/login',login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);
router.put('/forgotpassword',ForgotPassword)
router.put('/resetpassword',ResetPassword)

//admin
router.get('/admins',verifyToken,getAdmins)
router.post('/admin-login',loginAdmin);
router.post('/admin-register',registerAdmin);
router.delete('/admin-logout', LogoutAdmin);
router.get('/admin-token', refreshTokenRegister);

//makanan
router.get('/makanan', getMakanan);
router.get('/makanan/:id', getMakananById);
router.post('/makanan', upload.single('image'), createMakanan);
router.put('/makanan/:id', upload.single('image'), updateMakanan);
router.delete('/makanan/:id', deleteMakanan);




export default router;
