import Post, { IPost } from "../models/post_model";
import Comment from "../models/comment_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthRequest } from "../common/auth_middleware";

class PostController extends BaseController<IPost> {
    constructor() {
        super(Post);
    }

    async post(req: AuthRequest, res: Response) {
        console.log("Post: " + req.body);
        const userId = req.user._id;
        req.body.author = userId;

        super.post(req, res);
    }
    async deleteById(req: AuthRequest, res: Response) {
        try {
          await Comment.deleteMany({ reviewId: req.params.id });
        } catch (error) {
          res.status(500).json({ message: "Could not delete comments" });
        }
        console.log("Delete Post by Id:" + req.params.id);
        super.deleteById(req, res);
      }
     
       
    async putById2(req: AuthRequest, res: Response) {
        console.log("Put Post by Id:" + req.params.id);
        super.putById(req, res);
    }


}

export default new PostController();
