import React from "react";
import Modal from "../../../../components/Modal/Modal";

const VideoModal = ({ newRef, myRef, onClose }) => {

    return (
        <Modal title={`Call`} onClose={onClose}>
            <div className="chat__video-call-container">
                <video ref={newRef} />
                <video ref={myRef} />
            </div>
        </Modal>
    )
}

export default VideoModal;