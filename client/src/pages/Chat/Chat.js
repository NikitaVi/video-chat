import {useEffect, useState, useRef, useContext} from "react";
import { socket} from "../../socket";
import "./Chat.css"
import Message from "./components/Message/Message";
import { useSearchParams} from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import MembersModal from "./components/MembersModal";
import CallPrompt from "./components/CallPrompt";
import {connectHandler} from "../VideoChat/helpers";
import Peer from "peerjs";
import VideoModal from "./components/VideoModal";
// import {$messages, initializedChatEvents} from "../../store";
import {useStore} from "effector-react";
import {PeerContext} from "../../context";
// import {initializedChatEvents, messages} from "../../store";

const Chat = () => {
    // const messages = useStore($messages)
    const [value, setValue] = useState("");
    const [messages, setMessages] = useState([]);
    const peer = useContext(PeerContext);
    const [members, setMembers] = useState([]);
    const [membersModal, setMemberModal] = useState(false);
    const [callPrompt, setCallPrompt] = useState("");
    const [files, setFiles] = useState([]);
    const [videoModal, setVideoModal] = useState(false);
    const [params] = useSearchParams();
    const user = params.get("user");
    const room = params.get("room");

    const [myPeer, setMyPeer] = useState("");

    const newRef = useRef(null);
    const myRef = useRef(null);

    console.log(123)


    useEffect(() => {

        //Подключение чужого видео
        peer.on('open', function(id) {
            setMyPeer(id)
        });

        peer.on('connection', function(conn) {
            conn.on('data', function(data){
                // Will print 'hi!'
                const  getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                peer.on('call', async function(call) {
                    await getUserMedia({video: true, audio: true}, function(stream) {
                        call.answer(stream); // Answer the call with an A/V stream.
                        call.on('stream', function(remoteStream) {
                            myRef.current.srcObject = remoteStream
                            myRef.current.play()
                                .then(_ => {
                                })
                                .catch(error => {
                                    console.log(error)
                                });
                        });
                    }, function(err) {
                        console.log('Failed to get local stream' ,err);
                    });
                });
            });
        });

    }, []);

    useEffect(() => {

        // initializedChatEvents(user, room);

        socket.emit('join', {user, room});

        socket.on("chat message", (msg) => {
            setMessages((prev) => [...prev, msg])
        });

        socket.on("room", ({members}) => {
            setMembers(members)
        });

        socket.on("callRequestServ", ({user, type}) => {
            setCallPrompt(user);
        });

        socket.on("callAnswerServ", ({type, peerId}) => {

            if (type === "success") {
                connectHandler(peerId, peer, newRef);
                setVideoModal(true);
            } else {
                console.log("dawdwa")
            }
        })
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
            setFiles([]);
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
            {membersModal && <MembersModal
                onClose={() => setMemberModal(false)}
                members={members}/>
            }
            {!!callPrompt && <CallPrompt
                onClose={() => setCallPrompt("")}
                user={callPrompt}
                room={room}
                id={myPeer}
                setVideoModal={setVideoModal}
                peer={peer}
                newRef={newRef}
            />}
            {videoModal && <VideoModal
                onClose={() => setVideoModal(false)}
                myRef={myRef}
                newRef={newRef}
            />}
        </div>
    )
}

export default Chat;
