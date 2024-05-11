import {Redis} from "ioredis";
import "dotenv/config"

let redisClient:null|Redis=null;
let idleTimeout:null|ReturnType<typeof setTimeout>=null;
let max_ideal_time=100000;

function createRedisConnection(){
    if (redisClient) {
        redisClient.disconnect(); 
        redisClient=null;
    }
    redisClient = new Redis(process.env.REDIS_URI||"redis://localhost:6379");


    // Handling idle timeout
    idleTimeout && clearTimeout(idleTimeout);

    idleTimeout=setTimeout(()=>{
        redisClient?.disconnect();
        redisClient=null;
        console.log("Redis connection disconnected due to inactivity");
    },max_ideal_time);
    


    redisClient.on("ready",()=>{console.log("connected to redis")});

    return redisClient;
}


function RedisClient():Redis{
    if(!redisClient || redisClient.status==="end")
    {
        return createRedisConnection();
    }
    return redisClient;
}



export default RedisClient;