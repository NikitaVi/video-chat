import { Server } from "socket.io";
import express from 'express';
import { createServer } from 'http';
import UserController from "./Controllers/userController.js";
import {isExist} from "./utils.js";
import bodyParser from 'body-parser';
import fs from "fs";

const app = express();
const server = createServer(app);
const io = new Server(server);

const PRIVATE_NAME = "__private_Admin"

export const USER_LIST = [];

const controller = new UserController();

app.use(express.static("images"));

app.get("/api/members", controller.getMembers);

io.on('connection', (socket) => {

    socket.on('join', ({user, room}) => {

        const joinMessage = isExist(room ,user) ? `Hi again, ${user}` : `Welcome ${user}`;

        socket.join(room);

        if (!isExist(room, user)) {
            USER_LIST.push({user, room})
        }

        const currentUsers = USER_LIST.filter(item => item.room === room);

        socket.emit("chat message", {
            user: PRIVATE_NAME,
            message: joinMessage,
            type: "text"
        });

        socket.broadcast.to(room).emit("chat message", {
            user: PRIVATE_NAME,
            message: `${user} has joined to the room`,
            type: "text"
        });

        io.to(room).emit("room", {
            members: currentUsers
        });
    });

    socket.on('send message', ({user, message, file}, room) => {

        const objectToSend = {
            user: user,
            message: message,
        }

        if (!!file) {
            try {
                fs.writeFile(`./images/${file.name}`, file.file, (err) => console.log(err))
                objectToSend["file"] = `http://localhost:3000/${file.name}`;

            } catch (e) {
                socket.emit("chat message", {
                    user: PRIVATE_NAME,
                    message: "Sending has been failed...",
                    type: "text"
                });
                return
            }
        }

        console.log(objectToSend)

        io.to(room).emit('chat message', objectToSend);
    });

    socket.on('left', ({user, room}) => {
        socket.broadcast.to(room).emit("chat message", {
            user: PRIVATE_NAME,
            message: `${user} has left`,
            type: "text"
        });
    })
});

app.get('/', (req, res) => {
    res.sendFile("./index.html",{ root: '.' });
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
