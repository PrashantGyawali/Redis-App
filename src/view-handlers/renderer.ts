import ejs from 'ejs';
import PageGenerator from './pagination';
import { Request, Response} from 'express';
function renderer(req:Request,res:Response){
    if(res.locals.ratelimited==true)
    {
        let message:string=res.locals.ratelimitedType=="server"?"Server cannot handle new requests currently":"You are making too many requests. Please try again later.";
        let errorCode=res.locals.ratelimitedType=="server"?503:429;
        try {
            ejs.renderFile('src/views/Ratelimit.ejs', {message:message,errorCode:errorCode}, (err, html) => {
                if (err) {
                    // Handle error
                    console.error(err);
                } else {
                    // Send rendered HTML to client
                    res.send(html);
                }
            });
        } catch (err) {
            // Handle error
            console.error(err);
        }
    }
    if(res.locals.data)
    {
        try {
            ejs.renderFile('src/views/Results.ejs', { books: res.locals.data, query:res.locals.query,cache:res.locals.cache,cacheHit:res.locals.cacheHit,currentPage:res.locals.currentPage,pagination:PageGenerator }, (err, html) => {
                if (err) {
                    // Handle error
                    console.error(err);
                } else {
                    // Send rendered HTML to client
                    res.send(html);
                }
            });
        } catch (err) {
            // Handle error
            console.error(err);
        }
    }
    
}

export default renderer;