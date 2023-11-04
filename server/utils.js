import {USER_LIST} from "./index.js";

export const isExist = (room, user) => {
    return !!USER_LIST.find(item => item.room === room && item.user === user)
}
