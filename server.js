require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const server = require('http').Server(app)
const io = require('socket.io')(server, {cors: "*"})
const jwt = require("jsonwebtoken");
const { Console } = require('console');
const secretKey = process.env.ACCESS_TOKEN_SECRET;

// io.use((socket, next) => {
//     const {token} = socket.handshake.headers;
    
//     if (!token){
//         next(new Error("Access Token is not provided"));
//     }
    
//     try {
//         jwt.verify(token, secretKey);
//         next();
//     } catch {
//         next(new Error("Access Denied"));
//     }
// })

io.on('connection', (socket) =>{
    console.log('user connected');
    socket.on("takeAttendance", async (info) => {
        socket.name = info.userName;
        socket.to(info.classRoom).emit("studentJoin", info);
        
        // var size = io.of('/').adapter.rooms.get(info.classRoom).size;
        // var people = await io.in(info.classRoom).fetchSockets()
        // var users = people.map(socket => ({name: socket.name}))
        
        //socket.emit("numberPeople", size, users);
        //socket.to(info.roomName).emit("numberPeople", size, users);
    })

    // socket.on("sendAttendanceForm", async (info) => {
    //     socket.name = info.userName;
    //     socket.to(info.classRoom).emit("receiveAttendanceForm", info.attendaceForm)
    // })

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

    //Test attendance form for socket
    socket.on("sendAttendanceForm", (attendanceForm) => {
        //Send to all students that is in classID
        console.log("Teacher send attendanceForm with class Room", attendanceForm.classes);
        socket.to(attendanceForm.classes).emit("getAttendanceForm", JSON.stringify(attendanceForm));
    })

    socket.on("joinClassRoom", (info) => {
        if (typeof info === 'string') {
            try {
                info = JSON.parse(info);
                console.log("Converted info to JSON: ", info);
            } catch (error) {
                console.error("Error parsing info as JSON: ", error);
            }
        }
        console.log("User join class room: ", info.classRoom)
        socket.join(info.classRoom);
    })

    socket.on("sendAttendanceDetail", (attendanceDetail) => {
        socket.to(attendanceDetail.classDetail).emit("getAttendanceDetail", JSON.stringify(attendanceDetail))
    })

    socket.on('disconnect', (data) => console.log('User disconnected ',data));
})

server.listen(9000, () => console.log('listening on *:9000'));