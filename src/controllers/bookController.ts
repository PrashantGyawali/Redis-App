import { Book } from "../lib/types";
import RedisClient from "../services/redisClient.js";
import { NextFunction, Request, Response } from "express";

import { capitalizeFirstCharacter, validTag } from "../lib/utils.js";

async function bookController(req:Request,res:Response,next:NextFunction) {

    if(res.locals.data) return next();
    if(res.locals.ratelimited) return next();

    try{
        const query=req.query.search as string || "";

        let page=parseInt(req.query.page?.toString() as string || "1");
        page = page ? page : 1;
        page = page < 1 ? 1 : page;
        req.query.page=page.toString();
    
        res.locals.query=query;
        res.locals.currentPage=page;
    
        let itemsPerPage = 15;

        let baseURL="https://openlibrary.org/search.json?";
        const searchParams: Record<string, any> = new URLSearchParams();
        searchParams.set("title", query || "");
        searchParams.set("limit", itemsPerPage.toString());
        searchParams.set("page", page.toString());

        const finalURL = new URL(baseURL);
        finalURL.search = searchParams.toString();

        let result=await fetch(finalURL.toString());
        let resultJson=await result.json();
        let response= await resultJson.docs;

        let lastPage= Math.ceil(resultJson.numFound/itemsPerPage);

        let minifiedResponse= await response.map((x:Book)=> {
            return {
                title: x.title,
                author:x.author_name,
                publish_year:x.first_publish_year,
                genre:x?.subject?.filter((x:string)=>x.length>3&&x.length<20).filter((e:string)=>validTag(e)).map((e:string)=>capitalizeFirstCharacter(e.trim())).sort((a:string,b:string)=>a.length-b.length).slice(0,15),
                key:x.key,
                rating:x.ratings_average,
                imageId:x.cover_i
            };
        }); 
        let finalResponse={"results":minifiedResponse,"lastPage":lastPage>200?200:lastPage};
        RedisClient().setex(`books:${query || ""}:page:${page}`,86400, JSON.stringify(finalResponse));
        res.locals.data=finalResponse;
        return next();
    }
    catch(err){
        res.locals.error={code:500,message:"Internal Server Error"};
        return next();
    }
    
}


export default bookController;