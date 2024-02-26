import User, { IUser } from "../models/user_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthRequest } from "../common/auth_middleware";

class UserController extends BaseController<IUser> {
    constructor() {
        super(User);
    }

    async get(req: AuthRequest, res: Response) {
        console.log("Get Connected User: ");
        const id = req.user._id;
    
        try {
            const user = await User.findById(id).select([
                "name",
                "email",
                "imgUrl",
            ]);
    
            res.send(user); // Send the user object
        } catch (err) {
            res.status(500).json({ message: "unable to retrieve user data" });
        }
    }
    


    async putById2(req: AuthRequest, res: Response) {
        console.log("Put User", req.body);
        const id = req.user._id;

        try {
        const updatedUser = await this.model.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        const { ...updatedUserWithoutPassword } = updatedUser.toObject();
        res.status(200).send(updatedUserWithoutPassword);
        } catch (err) {
        res.status(500).json({ message: err.message });
        }
    }
}

export default new UserController();
