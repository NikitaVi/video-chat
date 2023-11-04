import { useEffect, useState} from "react";
import { socket} from "../../socket";
import "./Chat.css"
import Message from "./components/Message/Message";
import { useSearchParams} from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Modal from "../../components/Modal/Modal";

const Chat = () => {
    const [value, setValue] = useState("");
    const [messages, setMessages] = useState([]);
    const [members, setMembers] = useState([]);
    const [membersModal, setMemberModal] = useState(false)
    const [files, setFiles] = useState([]);
    const [params] = useSearchParams();
    const user = params.get("user");
    const room = params.get("room");

    useEffect(() => {
        socket.emit('join', {user, room});

        socket.on("chat message", (msg) => {
            setMessages(prev => [...prev, msg])
        });

        socket.on("room", ({members}) => {
            setMembers(members)
        });
    }, [user]);

    // interface Idata {
    //     user: string;
    //     message: string;
    //     file?: {
    //         name: string;
    //         file: fileType
    //     }
    // }

    const submitForm = () => {
        if (!!value || !!files.length) {
            const sendObject = {
                user,
                message: value,
            }

            if (!!files.length) {
                const fileObj = {
                    name: files[0].path,
                    file: files[0]
                }

                sendObject["file"] = fileObj
            }

            socket.emit("send message", sendObject, room);
            setFiles([])

        }
    };

    return (
        <div className="chat__container">
            <Header
                room={room}
                user={user}
                members={members}
                openMembers={() => setMemberModal(true)}
            />
            <div className="chat__messages">
                <ul className="chat__list">
                    {messages && messages.map((item, id) => (
                        <Message message={item} key={id}/>
                    ))}
                </ul>
            </div>
            <Footer
                submitForm={submitForm}
                setValue={setValue}
                value={value}
                files={files}
                setFiles={setFiles}
            />
            {membersModal && (
                <Modal title={"Members"} onClose={() => setMemberModal(false)}>
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
            )}
        </div>
    )
}

export default Chat;