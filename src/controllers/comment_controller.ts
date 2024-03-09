import Comment, { IComment } from "../models/comment_model";
import Post from "../models/post_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthRequest } from "../common/auth_middleware";

class CommentController extends BaseController<IComment> {
  constructor() {
    super(Comment);
  }

  async post(req: AuthRequest, res: Response) {
    try {
      const userId = req.user._id;
      const { content, postId } = req.body;

      const postFind = await Post.findById(postId);
      if (!postFind) {
        res.status(404).json({ message: "post not found" });
        return;
      }

      const comment = await Comment.create({
        content,
        author: userId,
        postId: postFind.id,
      });

      postFind.comments.push(comment.id);

      await postFind.save();
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}


export default new CommentController();

