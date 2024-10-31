import Users from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { kirimEmail } from '../helpers/index.js';



export const getUsers = async(req,res) => {
    try {
        const users = await Users.findAll({
            attributes:[
                "id","username","email","nama_kelas","createdAt"
            ]
        });
        res.json(users)
    } catch (error) {
        console.log(error)
    }
}

export const register = async(req,res) => {
    const {username,email,nama_kelas,password,confPassword} = req.body;
    if(password != confPassword) return res.status(400).json({msg:"password dan confirm password tidak cocok"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password,salt);
    try {
        await Users.create({
            username:username,
            email:email,
            nama_kelas:nama_kelas,
            password:hashPassword
        })
        res.json({msg:"register berhasil"})
    } catch (error) {
        console.log(error);
    }
}

export const login = async(req, res) => {
    try {
        const user = await Users.findAll({
            where:{
                username: req.body.username
            }
        });
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if(!match) return res.status(400).json({msg: "Wrong Password"});
        const userId = user[0].id;
        const username = user[0].name;
        const accessToken = jwt.sign({userId, username,}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '6000s'
        });
        const refreshToken = jwt.sign({userId, username,}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        await Users.update({refresh_token: refreshToken},{
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


export const Logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await Users.update({refresh_token: null},{
        where:{
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}

export const ForgotPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      console.log("Email yang diterima:", email);
  
      const user = await Users.findOne({ where: { email: email } });
  
      if (!user) {
        console.log("Pengguna tidak ditemukan");
        return res.status(404).json({ 
            message: "Email not found" 
        });
      }

      const token = jwt.sign({
        iduser:user._id
      },process.env.ACCESS_TOKEN_SECRET)

      await user.update(
        { resetPasswordToken: token }, // Data yang ingin diupdate
        { where: { id: user.id } }     // Kondisi untuk memilih record yang akan diupdate
      );

      const templateEmail = {
        from : "Tes Full Stack",
        to : email,
        subject :"Link reset Password",
        html :`<p> silahkan klik link dibawah ini untuk reset password</p><p>${process.env.CLIENT_URL}/resetpassword/${token}</p>`
      }
      kirimEmail(templateEmail) 
      return res.status(200).json({
        status : true,
        message: "link terkirim",
        // email: user.email  
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };

 export const ResetPassword = async(req,res) =>{
    const {token,password} = req.body
    const user = await Users.findOne({where :{resetPasswordToken:token}})
    if(user){
        const hashPassword = await bcrypt.hash(password,10)
        user.password = hashPassword
        await user.save()
        return res.status(201).json({
            status:true,
            message:"password berhasil diganti"
        })
    }
 } 