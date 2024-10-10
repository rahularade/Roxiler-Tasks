import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())

//import routes
import productRouter from './routes/product.routes.js'


//routes declaration
app.use("", productRouter)

export {app}