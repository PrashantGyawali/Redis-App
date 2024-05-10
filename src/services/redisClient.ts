import {Redis} from "ioredis";
import "dotenv/config"

const redisClient=new Redis(process.env.REDIS_URI||"redis://localhost:6379");
redisClient.on("ready",()=>{console.log("connected to redis")})

export default redisClient;