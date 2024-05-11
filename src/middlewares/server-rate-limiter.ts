import RedisClient from "../services/redisClient.js";
import { Request, Response, NextFunction } from "express";

export default async function serverRateLimiter(req:Request,res:Response,next:NextFunction) {

    if(res.locals.data){
        console.log("skipped")
        return next();
    };

    let totalRequests=await RedisClient().get("rateLimiter:server");
    if(!totalRequests){
        await RedisClient().setex("rateLimiter:server",86400,1);
    }
    else{
        if(parseInt(totalRequests)>100)
            {
                res.locals.ratelimited=true;
                res.locals.ratelimitedType="server";
            }
            else{
                RedisClient().incr("rateLimiter:server");
            }
            return next();
    }
}