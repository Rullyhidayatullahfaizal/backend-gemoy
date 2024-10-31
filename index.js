import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./config/database.js";
import router from "./routes/index.js";
import Admin from "./models/adminModel.js";
import bodyParser from "body-parser";
import makanans from "./models/makananModel.js";
import path from "path"
import Users from "./models/userModel.js";

dotenv.config()
const app = express();
const __dirname = path.resolve();


try {
    await db.authenticate();
    console.log("database connected");
    // await makanans.sync()
} catch (error) {
    console.error(error)
}

// Update with the correct Flutter port and IP
const allowedOrigins = ['http://localhost:3000', 'http://localhost:4000', 'http://localhost:59171','http://localhost:3001'];

const corsOptions = {
    origin: (origin, callback) => {
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

// Serve static files (for uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.listen(5000, () => console.log('running serting to port 5000'));