import {createStore, createEvent, createEffect, sample} from 'effector/compat'
import {socket} from "../socket";


//message
export const $messages = createStore([]);
export const $setMessages = createEvent();

$messages.on($setMessages, (state, data) => [...state, data])

export const postMessage = createEffect(() => {
    socket.on("chat message", (msg) => {
        $setMessages(msg)
    });
});

//modal

export const $modal = createStore({type: "", visible: false, data: ""});
export const $setModal = createEvent();

$modal.on($setModal, (_, modal) => modal);