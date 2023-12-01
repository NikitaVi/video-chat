export const connectHandler = (peerId, peer, newRef, myRef) => {

    peer.on('connection', function(conn) {
        conn.on('data', function(){
            //@ts-ignore
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
}
