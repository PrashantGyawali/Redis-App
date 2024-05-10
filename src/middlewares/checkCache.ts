import { Request, Response, NextFunction } from 'express';
import redisClient from '../services/redisClient';


async function checkCache(req:Request,res:Response,next:NextFunction){

    if(req.query.cache!=="true"){
        res.locals.cache=false;
        console.log("Not using cache");
        return next();
    }
    
    const query=req.query.search as string || "";
    let page=parseInt(req.query.page?.toString() as string || "1");
    page = page ? page : 1;
    page = page < 1 ? 1 : page;
    req.query.page=page.toString();
    
    res.locals.query=query;
    res.locals.cache=true;
    res.locals.currentPage=page;

    const cacheValue = await redisClient.get(`books:${query || ""}:page:${page}`);
    if (cacheValue) {
        console.log("Cache hit");
        res.locals.data=JSON.parse(cacheValue);
        res.locals.cacheHit=true;
        return next();
    }
    else {
        return next();
    }
}

export default checkCache;


