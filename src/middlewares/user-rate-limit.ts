import { Request,Response,NextFunction } from "express";
import redisClient from "../services/redisClient";

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


        requests = await redisClient.incr(key);
        if (requests === 1) {
            await redisClient.expire(key, timePeriod);
        }


        if(requests>maxRequests){
            res.locals.ratelimited=true;
            res.locals.ratelimitedType="client";
        }


        let ttl=await redisClient.ttl(key);
        if(ttl<0){
            await redisClient.pipeline().del(key).incr(key).expire(key,timePeriod).exec();
            ttl=timePeriod
        }
        return next();
    }
}


export default userRateLimit;