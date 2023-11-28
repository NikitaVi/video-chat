import { Server } from "socket.io";
import express from 'express';
import { createServer } from 'http';
import UserController from "./Controllers/userController.js";
import { isExist} from "./utils.js";
import { PeerServer } from "peer";
import CallsController from "./Controllers/callsController.js";
import MessageController from "./Controllers/messageController.js";

const app = express();
const server = createServer(app);
const io = new Server(server);

const PRIVATE_NAME = "__private_Admin"

export const USER_LIST = [];

const userController = new UserController();
const callsController = new CallsController();
const messageController = new MessageController();

app.use(express.static("images"));

app.get("/api/members", userController.getMembers);

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

    messageController.messageListenHandler(socket, io);

    callsController.callRequestHandler(socket);

    callsController.callAnswerHandler(socket);

    socket.on('left', ({user, room}) => {
        socket.broadcast.to(room).emit("chat message", {
            user: PRIVATE_NAME,
            message: `${user} has left`,
        });
    });
});

app.get('/', (_req, res) => {
    res.sendFile("./index.html",{ root: '.' });
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});

PeerServer({ port: 9000, path: "/myapp" });

