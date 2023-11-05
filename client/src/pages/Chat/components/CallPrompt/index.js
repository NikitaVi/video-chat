import React from "react";
import Modal from "../../../../components/Modal/Modal";
import "../../Chat.css"
import {BiPhone, BiPhoneOff} from "react-icons/bi";
import Peer from "peerjs";
import {socket} from "../../../../socket";

const CallPrompt = ({user, onClose, room}) => {

    const answerCallHandler = (answer) => {
        if (answer) {
            const peer = new Peer();

            peer.on('open', function(id) {
                socket.emit("callAnswer", {type: "success", room: room, peerId: id, toUser: user})
            });
        } else {
            socket.emit("callAnswer", {type: "failure", room: room, toUser: user})
        }
        onClose();
    }

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
