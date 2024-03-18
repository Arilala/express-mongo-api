import { Server} from 'socket.io'
import http from 'http'
import express from 'express'
import logger from "../logger/logger.js";

const app = express();

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:["*"],
        methods:["GET","POST"]
    }
})


export const getReceiverSocketId = (receiverId) =>{
  
    return userSocketMap[receiverId]
}

const userSocketMap = {}



io.on("connection", (socket)=>{
    
    const userId = socket.handshake.query.userId
    logger.info("a user connected "+socket.id+": "+userId)
    if(userId != "undefined") userSocketMap[userId] = socket.id
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect",()=>{
        logger.info("user disconnected "+socket.id)
        delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})




export {app,io,server}