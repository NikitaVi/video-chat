import fs from "fs";

class MessageController {
    messageListenHandler(socket, io) {
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
    }
}

export default MessageController;