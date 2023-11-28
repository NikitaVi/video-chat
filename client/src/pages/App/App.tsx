import React, {useEffect} from "react";
import {socket} from "../../socket";
import {Routes, Route, BrowserRouter} from "react-router-dom";
import Home from "../Home/Home";
import './App.css';
import Chat from "../Chat/Chat";
import VideoChat from "../VideoChat";
import Peer from "peerjs";
import {PeerContext} from "../../context";

const App = () => {

    useEffect(() => {
        socket.on('connect', () => {});
    }, []);

    return (
        <div className="container">
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home />}/>
                    <Route path="/chat" element={<Chat />}/>
                    <Route path="/video" element={<VideoChat />}/>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App;

export const peer = new Peer({
    host: "localhost",
    port: 9000,
    path: "/myapp",
});
