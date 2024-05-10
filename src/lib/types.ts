type Book = {
    title: string,
    author:string[],
    publish_year:number,
    genre:string[],
    key:string,
    rating:number,
    imageId:string,
} & { [key: string]: any };


export { Book };