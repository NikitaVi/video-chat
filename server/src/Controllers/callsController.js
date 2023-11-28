import {findUserById} from "../utils.js";

class CallsController {

    callRequestHandler(socket) {
        socket.on("callRequest", ({user, room}) => {
            socket.broadcast.to(room).emit("callRequestServ", {
                user: user,
                type: "call"
            });
        });
    };

    callAnswerHandler(socket) {
        socket.on("callAnswer", ({type, room, peerId, toUser}) => {
            if (type === "success") {
                socket.broadcast.to(findUserById(room, toUser)).emit('callAnswerServ', {type, peerId});
            } else {
                socket.broadcast.to(findUserById(room, toUser)).emit('callAnswerServ', {type });
            }
        });
    }
}

export default CallsController;
