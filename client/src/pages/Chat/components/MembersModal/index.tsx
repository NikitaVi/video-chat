import React from "react";
import Modal from "../../../../components/Modal/Modal";

const MembersModal = ({onClose, members}) => {

    return (
        <Modal title={"Members"} onClose={onClose}>
            <div className="chat__members-container">
                <ul className="chat__members-list">
                    {members.map(member => (
                        <div className="chat__member">
                            {member.user}
                        </div>
                    ))}
                </ul>
            </div>
        </Modal>
    )
};

export default MembersModal;
