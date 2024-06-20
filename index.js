import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./config/database.js";
import router from "./routes/index.js";
import Admin from "./models/adminModel.js";
import bodyParser from "body-parser";
import Guruis from "./models/guruModel.js";
import Kelas from "./models/kelasModel.js";
dotenv.config()
const app = express();
try {
    await db.authenticate();
    console.log("database connected");
    await Kelas.sync()
} catch (error) {
    console.error(error)
}

const allowedOrigins = ['http://localhost:3000', 'http://localhost:4000','http://127.0.0.1:52701'];

const corsOptions = {
    origin: (origin, callback) => {
        // Cek apakah origin ada di daftar yang diizinkan
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(express.json());
app.use(router);


app.listen(5000, () => console.log('running serting to port 5000'));