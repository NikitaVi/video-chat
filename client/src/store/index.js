import {createStore, createEvent, createEffect, sample} from 'effector/compat'
import {socket} from "../socket";

export const $messages = createStore([]);
const setMessages = createEvent();

$messages.on(setMessages, (state, data) => [...state, data])

export const initializedChatEvents = createEffect((user, room) => {
    socket.emit('join', {user, room});

    socket.on("chat message", (msg) => {
        console.log(msg)
        setMessages(msg)
    });
});