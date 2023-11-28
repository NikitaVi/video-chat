import {USER_LIST} from "../index.js";

class UserController {

    async getMembers(req, res) {
        const currentUsers = USER_LIST.filter(item => item.room === req.query.room)
        res.send({"members": currentUsers})
    }
}

export default UserController;
