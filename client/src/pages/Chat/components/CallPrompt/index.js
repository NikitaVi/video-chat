import React, {useEffect} from "react";
import Modal from "../../../../components/Modal/Modal";
import "../../Chat.css"
import {BiPhone, BiPhoneOff} from "react-icons/bi";
import Peer from "peerjs";
import {socket} from "../../../../socket";

const CallPrompt = ({user, onClose, room, id, setVideoModal}) => {

    const answerCallHandler = (answer) => {
        if (answer) {
            socket.emit("callAnswer", {type: "success", room: room, peerId: id, toUser: user});
            setVideoModal(true)
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
