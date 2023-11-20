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
import VideoModal from "./components/VideoModal";
import {$messages, $modal, $setModal, postMessage} from "../../store";
import {useStore} from "effector-react";
import Peer from "peerjs";

const Chat = () => {
    const messages = useStore($messages);
    const modal = useStore($modal);
    const [value, setValue] = useState("");
    const [members, setMembers] = useState([]);
    const [files, setFiles] = useState([]);
    const peer = new Peer({
        host: "localhost",
        port: 9000,
        path: "/myapp",
    });

    const [params] = useSearchParams();
    const user = params.get("user");
    const room = params.get("room");

    const [myPeer, setMyPeer] = useState("");

    const newRef = useRef(null);
    const myRef = useRef(null);

    useEffect(() => {

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
                        if (myRef) {
                            myRef.current.srcObject = stream
                            myRef.current.play()
                                .then(_ => {
                                })
                                .catch(error => {
                                    console.log(error)
                                });
                        }
                        call.on('stream', function(remoteStream) {
                            if (newRef) {
                                newRef.current.srcObject = remoteStream
                                newRef.current.play()
                                    .then(_ => {
                                    })
                                    .catch(error => {
                                        console.log(error)
                                    });
                            }
                        });
                    }, function(err) {
                        console.log('Failed to get local stream' ,err);
                    });
                });
            });
        });

    }, []);

    useEffect(() => {

        socket.emit('join', {user, room});

        postMessage();

        socket.on("room", ({members}) => {
            setMembers(members)
        });

        socket.on("callRequestServ", ({user, type}) => {
            $setModal({type: "callPrompt", visible: true, data: user} )
        });

        socket.on("callAnswerServ", ({type, peerId}) => {

            if (type === "success") {
                connectHandler(peerId, peer, newRef, myRef);
                $setModal({type: "video", visible: true} )
            } else {
                console.log("error")
            }
        })
    }, [user]);

    console.log(modal)

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
            setValue("");
        }
    };

    return (
        <div className="chat__container">
            <Header
                room={room}
                user={user}
                members={members}
                openMembers={() => $setModal({type: "members", visible: true})}
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
            {modal.visible && modal.type === "members" && <MembersModal
                onClose={() => $setModal({type: "members", visible: false})}
                members={members}/>
            }
            {modal.visible && modal.type === "callPrompt" && <CallPrompt
                onClose={() => $setModal({type: "video", visible: true, data: ""})}
                user={modal.data}
                room={room}
                id={myPeer}
                peer={peer}
                newRef={newRef}
                />
            }
            {modal.type === "video" && modal.visible && <VideoModal
                onClose={() => $setModal({type: "video", visible: false})}
                myRef={myRef}
                newRef={newRef}
            />
            }
        </div>
    )
}

export default Chat;
