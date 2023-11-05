import React from "react";
import {Link} from "react-router-dom";
import {BiChevronLeft, BiPhone} from "react-icons/bi";
import {socket} from "../../../../socket";

const Header = ({ user, room, members, openMembers }) => {

    const leftHandler = () => {
        socket.emit("left", {user, room})
    }

    const callHandler = () => {
        socket.emit("callRequest", {user, room})
    }

    return (
        <div className="chat__header-container">
            <div className="chat__header-left-container">
                <Link
                    to="/"
                    onClick={leftHandler}
                    className="chat__back-link"
                >
                    <BiChevronLeft className="chat__back-icon" size={30}/>
                </Link>
                <div className="chat__room-header-container">
                    <h3 className="chat__title">{`Room №${room}`}</h3>
                    {!!members.length && <span onClick={openMembers}>{`members: ${members.length}`}</span>}
                </div>
            </div>
            <div className="chat__header-right-container">
                <button className="chat__call-button" onClick={callHandler}>
                    <BiPhone size={25} />
                </button>
            </div>
        </div>
    )
}

export default Header;
