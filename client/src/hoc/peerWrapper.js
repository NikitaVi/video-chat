import React, {useEffect, useState} from "react";
import Peer from "peerjs";

const peerWrapper = (Component) => {

    const [myPeer, setMyPeer] = useState("");

    const peer = new Peer();

    return () => {
        useEffect(() => {
            useEffect(() => {
                peer.on('open', function(id) {
                    setMyPeer(id)
                });

                peer.on('connection', function(conn) {
                    conn.on('data', function(data){
                        // Will print 'hi!'
                        console.log(data);

                        const  getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                        peer.on('call', async function(call) {
                            await getUserMedia({video: false, audio: true}, function(stream) {
                                console.log(stream);
                                call.answer(stream); // Answer the call with an A/V stream.
                                call.on('stream', function(remoteStream) {
                                    // newRef.current.src = remoteStream
                                });
                            }, function(err) {
                                console.log('Failed to get local stream' ,err);
                            });
                        });
                    });
                });

            }, []);
        }, [])
        return <Component/>
    };
}

export default peerWrapper;
