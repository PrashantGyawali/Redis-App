import { Book } from "../lib/types";
import redisClient from "../services/redisClient";
import { NextFunction, Request, Response } from "express";

import { capitalizeFirstCharacter, validTag } from "../lib/utils";

async function bookController(req:Request,res:Response,next:NextFunction) {

    if(res.locals.data) return next();
    if(res.locals.ratelimited) return next();

    const query=req.query.search as string || "";

    let page=parseInt(req.query.page?.toString() as string || "1");
    page = page ? page : 1;
    page = page < 1 ? 1 : page;
    req.query.page=page.toString();

    res.locals.query=query;
    res.locals.currentPage=page;

    let itemsPerPage = 15;
    let result=await fetch("https://openlibrary.org/search.json?title="+query+"&limit="+itemsPerPage+"&page="+page);
    let resultJson=await result.json();

    let response= await resultJson.docs;
    let lastPage= Math.ceil(resultJson.numFound/10);
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
    redisClient.setex(`books:${query || ""}:page:${page}`,86400, JSON.stringify(finalResponse));
    res.locals.data=finalResponse;
    return next();
}


export default bookController;