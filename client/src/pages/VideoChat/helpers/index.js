export const connectHandler = (peerId, peer, newRef, myRef) => {

    const conn = peer.connect(peerId);

    if (conn) {
        //Подключение чужого видео
        conn.on('open',  function(){
            conn.send('hi!');

            const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            getUserMedia({video: true, audio: true}, function(stream) {
                const call = peer.call(peerId, stream);
                if (myRef) {
                    myRef.current.srcObject = stream;
                    myRef.current.play()
                        .then(_ => {
                        })
                        .catch(error => {
                            console.log(error)
                        });
                }
                call.on('stream',  function(remoteStream) {
                    if (newRef) {
                        newRef.current.srcObject = remoteStream;
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
    }
}
