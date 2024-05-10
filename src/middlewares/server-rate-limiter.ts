import redisClient from "../services/redisClient";
import { Request, Response, NextFunction } from "express";

export default async function serverRateLimiter(req:Request,res:Response,next:NextFunction) {

    if(res.locals.data){
        console.log("skipped")
        return next();
    };

    let totalRequests=await redisClient.get("rateLimiter:server");
    if(!totalRequests){
        await redisClient.setex("rateLimiter:server",86400,1);
    }
    else{
        if(parseInt(totalRequests)>100)
            {
                res.locals.ratelimited=true;
                res.locals.ratelimitedType="server";
            }
            else{
                redisClient.incr("rateLimiter:server");
            }
            return next();
    }
}