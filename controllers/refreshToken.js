import Users from "../models/userModel.js";
import Admins from "../models/adminModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async(req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(401);
        const user = await Users.findAll({
            where:{
                refresh_token: refreshToken
            }
        });
        if(!user[0]) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if(err) return res.sendStatus(403);
            const userId = user[0].id;
            const username = user[0].username;
            const accessToken = jwt.sign({userId, username, }, process.env.ACCESS_TOKEN_SECRET,{
                expiresIn: '15000s'
            });
            res.json({ accessToken });
        });
    } catch (error) {
        console.log(error);
    }
}


export const refreshTokenRegister =  async(req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(401);
        const user = await Admins.findAll({
            where:{
                refresh_token: refreshToken
            }
        });
        if(!user[0]) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if(err) return res.sendStatus(403);
            const userId = user[0].id;
            const username = user[0].username;
            const accessToken = jwt.sign({userId, username, }, process.env.ACCESS_TOKEN_SECRET,{
                expiresIn: '100000s'
            });
            res.json({ accessToken });
        });
    } catch (error) {
        console.log(error);
    }
}