import { Server } from "socket.io";
import express from 'express';
import { createServer } from 'http';
import UserController from "./Controllers/userController.js";
import {findUserById, isExist} from "./utils.js";
import fs from "fs";
import { PeerServer } from "peer";

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
            USER_LIST.push({user, room, id: socket.id})
        } else {
            const idx = USER_LIST.findIndex(item => (item.room === room && item.user === user))
            USER_LIST[idx] = {...USER_LIST[idx], id: socket.id}
        }

        const currentUsers = USER_LIST.filter(item => item.room === room);

        socket.emit("chat message", {
            user: PRIVATE_NAME,
            message: joinMessage,
        });

        socket.broadcast.to(room).emit("chat message", {
            user: PRIVATE_NAME,
            message: `${user} has joined to the room`,
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
                });
                return
            }
        }

        io.to(room).emit('chat message', objectToSend);
    });

    socket.on("callRequest", ({user, room}) => {
        socket.broadcast.to(room).emit("callRequestServ", {
            user: user,
            type: "call"
        });
    })
    socket.on("callAnswer", ({type, room, peerId, toUser}) => {
        if (type === "success") {
            socket.broadcast.to(findUserById(room, toUser)).emit('callAnswerServ', {type, peerId});
        } else {
            socket.broadcast.to(findUserById(room, toUser)).emit('callAnswerServ', {type });
        }
    })

    socket.on('left', ({user, room}) => {
        socket.broadcast.to(room).emit("chat message", {
            user: PRIVATE_NAME,
            message: `${user} has left`,
        });
    })
});

app.get('/', (req, res) => {
    res.sendFile("./index.html",{ root: '.' });
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});

const peerServer = PeerServer({ port: 9000, path: "/myapp" });

