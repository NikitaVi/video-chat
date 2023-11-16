import { io } from 'socket.io-client';
import axios from "axios";

// "undefined" means the URL will be computed from the `window.location` object
const URL = 'http://localhost:3000';

export const socket = io(URL);

export const getMembers = async (room) => {
    try {
        const response = await axios.get(URL + `/api/members?room=${room}`)
        return response
    } catch (e) {
        console.log(e)
    }
}
