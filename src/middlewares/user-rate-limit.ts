import { Request,Response,NextFunction } from "express";
import RedisClient from "../services/redisClient.js";

function userRateLimit(maxRequests:number,timePeriod:number) {
    return async function(req:Request,res:Response,next:NextFunction)
    {
        if(res.locals.data) return next();
        if(res.locals.ratelimited) return next();

        let ip=req.ip;
        if(!ip)
        {
            console.log("No IP found");
            return res.status(403).json({
                response: "error",
                callsInMinute: 0,
                message: "No IP found"
            });
        }

        let key = `rateLimiter:user:${ip}`;
        let requests: number;


        requests = await RedisClient().incr(key);
        if (requests === 1) {
            await RedisClient().expire(key, timePeriod);
        }


        if(requests>maxRequests){
            res.locals.ratelimited=true;
            res.locals.ratelimitedType="client";
        }


        let ttl=await RedisClient().ttl(key);
        if(ttl<0){
            await RedisClient().pipeline().del(key).incr(key).expire(key,timePeriod).exec();
            ttl=timePeriod
        }
        return next();
    }
}


export default userRateLimit;