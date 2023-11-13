import React, {useEffect} from "react";
import Modal from "../../../../components/Modal/Modal";
import "../../Chat.css"
import {BiPhone, BiPhoneOff} from "react-icons/bi";
import Peer from "peerjs";
import {socket} from "../../../../socket";

const CallPrompt = ({user, onClose, room}) => {

    const peer = new Peer();

    const answerCallHandler = (answer) => {
        if (answer) {

            peer.on('open', function(id) {
                console.log("answeer")
                socket.emit("callAnswer", {type: "success", room: room, peerId: id, toUser: user})
            });


        } else {
            socket.emit("callAnswer", {type: "failure", room: room, toUser: user})
        }
        onClose();
    }

    useEffect(() => {
        peer.on('connection', function(conn) {
            conn.on('data', function(data){

                const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                peer.on('call', async function(call) {
                    await getUserMedia({video: false, audio: true}, function(stream) {
                        console.log(stream);
                        call.answer(stream); // Answer the call with an A/V stream.
                        call.on('stream', function(remoteStream) {
                        });
                    }, function(err) {
                        console.log('Failed to get local stream' ,err);
                    });
                });
            });
        });
    }, []);

    return (
        <Modal title={`${user} is calling!`} onClose={onClose}>
            <div className="chat__call-modal-container">
                <button className="chat__call-answer" onClick={() => answerCallHandler(true)}>
                    <BiPhone size={30}/>
                </button>
                <button className="chat__call-off" onClick={() => answerCallHandler(false)}>
                    <BiPhoneOff size={30}/>
                </button>
            </div>
        </Modal>
    )
};

export default CallPrompt;
