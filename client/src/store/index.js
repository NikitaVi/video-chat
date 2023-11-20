import {createStore, createEvent, createEffect, sample, combine} from 'effector/compat'
import {socket} from "../socket";

//message
const $messages = createStore([]);
export const $setMessages = createEvent();

$messages.on($setMessages, (state, data) => [...state, data])

export const postMessage = createEffect(() => {
    socket.on("chat message", (msg) => {
        $setMessages(msg)
    });
});

//modal

const $modal = createStore({type: "", visible: false, data: ""});
export const $setModal = createEvent();

$modal.on($setModal, (_, modal) => modal);

//members

const $members = createStore([]);
export const $setMembers = createEvent();

$members.on($setMembers, (_, members) => members);

//myPeer

const $myPeer = createStore("");
export const $setMyPeer = createEvent();

$myPeer.on($setMyPeer, (_, peer) => peer);

export const $core = combine(
    $messages, $modal, $members, $myPeer,
    ($messages, $modal, $members, $myPeer) => ({
        messages: $messages,
        modal: $modal,
        members: $members,
        myPeer: $myPeer
    })
)



