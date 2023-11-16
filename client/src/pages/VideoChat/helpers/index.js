export const connectHandler = (peerId, peer, newRef) => {

    const conn = peer.connect(peerId);

    //Подключение чужого видео
    conn.on('open',  function(){
        conn.send('hi!');

        const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        getUserMedia({video: true, audio: true}, function(stream) {
            const call = peer.call(peerId, stream);
            call.on('stream',  function(remoteStream) {
                newRef.current.srcObject = remoteStream;
                newRef.current.play()
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
}
