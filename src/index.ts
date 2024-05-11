import express, { json, urlencoded } from "express";
import cors from "cors";
import serverRateLimiter from "./middlewares/server-rate-limiter.js";
import checkCache from "./middlewares/checkCache.js";
import bookController from "./controllers/bookController.js";
import renderer from "./view-handlers/renderer.js";
import "dotenv/config";
import userRateLimit from "./middlewares/user-rate-limit.js";


const app=express();


app.use(urlencoded({extended:true}));
app.use(json());
app.use(cors({origin:["http://localhost:3000",process.env.FRONTEND_URL||"http://localhost:5173"]}));
app.set('trust proxy', true);
app.use('/public', express.static('public'))
app.set('view engine', 'ejs');

app.get("/books",checkCache,serverRateLimiter,userRateLimit(15,3600),bookController,renderer);


app.listen(process.env.PORT || 3000,()=>{
    console.log("Server started");
});


