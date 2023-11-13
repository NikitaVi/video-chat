import React, {useEffect, useRef, useState} from 'react';
import Peer from "peerjs";


const VideoChat = () => {

    const [connectPeer, setConnectPeer] = useState("");
    const [myPeer, setMyPeer] = useState("");

    const newRef = useRef(null);
    const myRef = useRef(null);


    const peer = new Peer();

    // useEffect(() => {
    //     peer.on('open', function(id) {
    //         setMyPeer(id)
    //     });
    //
    //     peer.on('connection', function(conn) {
    //         conn.on('data', function(data){
    //             // Will print 'hi!'
    //             console.log(data);
    //
    //             const  getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    //             peer.on('call', async function(call) {
    //                 await getUserMedia({video: false, audio: true}, function(stream) {
    //                     console.log(stream);
    //                     call.answer(stream); // Answer the call with an A/V stream.
    //                     call.on('stream', function(remoteStream) {
    //                        newRef.current.src = remoteStream
    //                     });
    //                 }, function(err) {
    //                     console.log('Failed to get local stream' ,err);
    //                 });
    //             });
    //         });
    //     });
    //
    // }, []);

    const connectHandler = () => {
        const conn = peer.connect(connectPeer);

        conn.on('open',  function(){

            conn.send('hi!');

            const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            getUserMedia({video: false, audio: true}, function(stream) {
                console.log(stream);

                const call = peer.call(connectPeer, stream);
                call.on('stream', function(remoteStream) {
                    myRef.current.src = remoteStream
                });
            }, function(err) {
                console.log('Failed to get local stream' ,err);
            });
        });

    }

    return (
        <>
            {myPeer && <h1>{myPeer}</h1>}
            <input value={connectPeer} onChange={(e) => setConnectPeer(e.target.value)} />
            <button onClick={connectHandler} >Connect</button>
            <video ref={newRef} />
            <video ref={myRef} />
        </>
    )
};

export default VideoChat;
