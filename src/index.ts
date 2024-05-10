import express, { json, urlencoded } from "express";
import cors from "cors";
import serverRateLimiter from "./middlewares/server-rate-limiter";
import checkCache from "./middlewares/checkCache";
import bookController from "./controllers/bookController";
import renderer from "./view-handlers/renderer";
import "dotenv/config";
import userRateLimit from "./middlewares/user-rate-limit";


const app=express();


app.use(urlencoded({extended:true}));
app.use(json());
app.use(cors({origin:["http://localhost:3000",process.env.FRONTEND_URL||"http://localhost:5173"]}));
app.set('trust proxy', true);
app.use('/public', express.static('public'))

app.get("/books",checkCache,serverRateLimiter,userRateLimit(15,3600),bookController,renderer);


app.listen(process.env.PORT || 3000,()=>{
    console.log("Server started");
});


