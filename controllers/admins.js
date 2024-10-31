import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import Admins from "../models/adminModel.js";


export const getAdmins = async(req,res) => {
    try {
        const admins = await Admins.findAll({
            attributes:[
                "id","username",
            ]
        });
        res.json(admins)
    } catch (error) {
        console.log(error)
    }
}

export const loginAdmin = async(req, res) => {
    try {
        const user = await Admins.findAll({
            where:{
                username: req.body.username
            }
        });
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if(!match) return res.status(400).json({msg: "Wrong Password"});
        const userId = user[0].id;
        const username = user[0].name;
        const accessToken = jwt.sign({userId, username,}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '10000s'
        });
        const refreshToken = jwt.sign({userId, username,}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        await Admins.update({refresh_token: refreshToken},{
            where:{
                id: userId
            }
        });
        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
    } catch (error) {
        res.status(404).json({msg:"Email tidak ditemukan"});
    }
}






export const registerAdmin = async(req,res) => {
    const {username,password,confPassword} = req.body;
    if(password != confPassword) return res.status(400).json({msg:"password dan confirm password tidak cocok"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password,salt);
    try {
        await Admins.create({
            username:username,
            password:hashPassword
        })
        res.json({msg:"register berhasil"})
    } catch (error) {
        console.log(error);
    }
}

export const LogoutAdmin = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Admins.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await Admins.update({refresh_token: null},{
        where:{
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}