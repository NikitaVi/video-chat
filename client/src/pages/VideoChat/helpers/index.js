import Peer from "peerjs";

export const connectHandler = (peerId) => {

    const peer = new Peer();

    const conn = peer.connect(peerId);

    conn.on('open',  function(){

        conn.send('hi!');

        const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        console.log(4)
        getUserMedia({video: false, audio: true}, function(stream) {

            const call = peer.call(peerId, stream);
            call.on('stream', function(remoteStream) {
            });
        }, function(err) {
            console.log('Failed to get local stream' ,err);
        });
    });

}
