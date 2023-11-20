import React from "react";
import Modal from "../../../../components/Modal/Modal";

const VideoModal = ({ newRef, myRef, onClose }) => {

    return (
        <Modal title={`Call`} onClose={onClose}>
            <div className="chat__video-call-container">
                <div className="chat__video-wrapper">
                    <video ref={newRef} className="chat__video-remote"/>
                    <video ref={myRef} className="chat__video-mine"/>
                </div>
            </div>
        </Modal>
    )
}

export default VideoModal;