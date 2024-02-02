import User, { IUser } from "../models/user_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthRequest } from "../common/auth_middleware";

class UserController extends BaseController<IUser> {
  constructor() {
    super(User);
  }
  async get(req: AuthRequest, res: Response) {
    console.log("getUser:" + req.body);
    super.get(req, res);
  }
  async getById(req: AuthRequest, res: Response) {
    console.log("getUserById:" + req.body);
    super.getById(req, res);
  }
  async post(req: AuthRequest, res: Response) {
    console.log("postUser:" + req.body);
    super.post(req, res);
  }
    async putById(req: AuthRequest, res: Response) {
        console.log("putUser By Id:" + req.params.id);
        super.putById(req, res);
    }
    async deleteById(req: AuthRequest, res: Response) {
        console.log("deleteUser By Id:" + req.params.id);
        super.deleteById(req, res);
    }


  
}

export default new UserController();