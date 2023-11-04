import React, {useMemo} from "react";
import "../../Chat.css"
import {PRIVATE_NAME} from "../../../../constant";
import {useSearchParams} from "react-router-dom";

const Message = ({message: {user, message, file}}) => {
    const [params] = useSearchParams();
    const userName = params.get("user");

    const roleClass = useMemo(() => {
        if (user === userName) {
            return "chat__message-self"
        } else if (user === PRIVATE_NAME) {
            return "chat__message-admin"
        } else {
            return "chat__message"
        }
    }, [userName])

    return (
        <li className="chat__message-wrapper">
            <div className={`chat__mess ${roleClass}`}>
                {user !== PRIVATE_NAME && <div className="chat__user-name">{user}</div>}
                    <span>{message}</span>
                    {file && <img src={file} className="chat__image" alt={'message'}/>}
            </div>
        </li>
    )
}

export default Message;
