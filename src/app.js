import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser";

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


app.use(express.json({limit: "16kb"}))
// fristly express dont do it by itself  we need to use third pirty libarary to  use property like limit for ex body parser
app.use (express.urlencoded({extended: true , limit: "16kb"}))
// this use to encoded url in express extended allow to nesting in objects 
app.use(express.static("public"))

export default app;