require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const server = require('http').Server(app)
const io = require('socket.io')(server, {cors: "*"})
const jwt = require("jsonwebtoken");
const secretKey = process.env.ACCESS_TOKEN_SECRET;

io.use((socket, next) => {
    const {token} = socket.handshake.headers;
    
    if (!token){
        next(new Error("Access Token is not provided"));
    }
    
    try {
        jwt.verify(token, secretKey);
        next();
    } catch {
        next(new Error("Access Denied"));
    }
})

io.on('connection', (socket) =>{

    socket.on("takeAttendance", async (info) => {
        socket.name = info.userName;
        socket.to(info.classRoom).emit("studentJoin", info);
        
        // var size = io.of('/').adapter.rooms.get(info.classRoom).size;
        // var people = await io.in(info.classRoom).fetchSockets()
        // var users = people.map(socket => ({name: socket.name}))
        
        //socket.emit("numberPeople", size, users);
        //socket.to(info.roomName).emit("numberPeople", size, users);
    })

    socket.on("joinClassRoom", async (info) => {
        socket.name = info.userName;
        socket.join(info.classRoom);
    })

    socket.on("sendAttendanceForm", async (info) => {
        socket.name = info.userName;
        socket.to(info.classRoom).emit("receiveAttendanceForm", info.attendaceForm)
    })

    // socket.on("call", info => {
    //     var object = {streamId: info.streamId, username: info.username}
    //     socket.to(info.roomname).emit("receive", object)
    // })

    // socket.on("leaveRoom", async (info) => {
    //     socket.to(info.roomname).emit("userLeave", info);
    //     socket.leave(info.roomname);
    //     if (io.of('/').adapter.rooms.get(info.roomname)){
    //         var size = io.of('/').adapter.rooms.get(info.roomname).size;
    //         var people = await io.in(info.roomname).fetchSockets()
    //         var users = people.map(socket => ({name: socket.name}))
    //     } 
    //     socket.emit("numberPeople", size, users);
    //     socket.to(info.roomname).emit("numberPeople", size, users);
    // })

    // socket.on('message', info => {
    //     socket.to(info.classRoom).emit('userMessage', info);
    // })
})

server.listen(9000)