
function PageGenerator(currentPage:number,lastPage:number,search:string,cache:string,toShow?:number){
    const pages:any[]=[];
    const pagesElements:string[]=[];

    let noOfPagesToShow=toShow || 7;

    if(lastPage<=noOfPagesToShow)
    {   for(let i=1;i<=lastPage;i++)
        {
            pagesElements.push(`<a href="/books?search=${search.split(" ").join("+")}&page=${Math.round(i)}&cache=${cache}" class="pageNumber ${ i==1 && "firstPageNumber"} ${i==lastPage && "lastPageNumber"} ${i==currentPage && "selected"}">${i}</a>`);
        }
        return pagesElements.join("\n");
    }

    for(let i=1;i<=lastPage;i++)
    { 
        if(i==1)
        {
            pages.push(1);
            continue;
        }
        if(i==lastPage)
        {
            pages.push(lastPage);
            continue;
        }
        if(i==currentPage)
        {
            pages.push(currentPage);
            continue;
        }
        if(i>=currentPage-(noOfPagesToShow-5)*0.5 && i<=currentPage+(noOfPagesToShow-5)*0.5)
        {
            !pages.includes(i) && pages.push(i);
            continue;
        }
    }

    if(currentPage<=4)
    {
        for(let i=1;pages.length<noOfPagesToShow-1;i++)
        {
            !pages.includes(i) && pages.push(i);
        }
        pages.push(lastPage-0.75);
    }
    else if(currentPage>=lastPage-3)
    {
        for(let i=lastPage;pages.length<noOfPagesToShow-1;i--)
        {
            !pages.includes(i) && pages.push(i);
        }
        pages.push(1.75);
    }
    else{
            pages.push(currentPage-(noOfPagesToShow-5)*0.5-0.75);
            pages.push(currentPage+(noOfPagesToShow-5)*0.5+0.75);
    }
    

    pages.sort((a,b)=>a-b).forEach((i,index)=>pagesElements.push(
        `<a href="/books?search=${search.split(" ").join("+")}&page=${Math.round(i)}&cache=${cache}" class="pageNumber ${ i==1 && "firstPageNumber"} ${i==lastPage && "lastPageNumber"} ${i==currentPage && "selected"}">${Math.round(i)!=i?"...":i}</a>`
    ));
    return pagesElements.join("\n");
}

export default PageGenerator;