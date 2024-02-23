import StudentPost, { IStudentPost } from "../models/post_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthRequest } from "../common/auth_middleware";

class StudentPostController extends BaseController<IStudentPost>{
    constructor() {
        super(StudentPost);
    }

    async post(req: AuthRequest, res: Response) {
        req.body.owner = req.user._id;
        return super.post(req, res);
    }
}

export default new StudentPostController();
