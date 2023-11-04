import React, {useEffect} from "react";
import {socket} from "../../socket";
import {Routes, Route, BrowserRouter} from "react-router-dom";
import Home from "../Home/Home";
import './App.css';
import Chat from "../Chat/Chat";

const App = () => {
    useEffect(() => {
        socket.on('connect', () => {});
    }, [])

    return (
        <div className="container">
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home />}/>
                    <Route path="/chat" element={<Chat/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App;
