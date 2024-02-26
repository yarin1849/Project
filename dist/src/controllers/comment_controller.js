"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const comment_model_1 = __importDefault(require("../models/comment_model"));
const post_model_1 = __importDefault(require("../models/post_model"));
const base_controller_1 = require("./base_controller");
class CommentController extends base_controller_1.BaseController {
    constructor() {
        super(comment_model_1.default);
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user._id;
                const { content, postId } = req.body;
                const comment1 = yield post_model_1.default.findById(postId);
                if (!comment1) {
                    res.status(404).json({ message: "post not found" });
                    return;
                }
                const comment = yield comment_model_1.default.create({
                    content,
                    author: userId,
                    postId: comment1.id,
                });
                comment1.comments.push(comment.id);
                yield comment1.save();
                res.status(201).json(comment);
            }
            catch (error) {
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
}
exports.default = new CommentController();
// import { Request, Response } from "express";
// //import { Model } from "mongoose";
// import { BaseController } from "./base_controller";
// import Comment, { IComment } from "../models/comment_model";
// // Extend the Request interface to include the user property
// declare module "express" {
//   interface Request {
//     user?: { _id: string };
//   }
// }
// class CommentController extends BaseController<IComment> {
//     constructor() {
//         super(Comment);
//     }
//     async post(req: Request, res: Response) {
//       try {
//         // Assuming you have some middleware to authenticate the user and attach their ID to req.user
//         const userId = req.user._id;
//         // Create a new comment with the user ID attached
//         const obj = await this.model.create({ ...req.body, user: userId });
//         res.status(201).send(obj);
//       } catch (err) {
//         console.log(err);
//         res.status(406).send("fail: " + err.message);
//       }
//     }
//     async putById(req: Request, res: Response) {
//       try {
//         const obj = await this.model.findByIdAndUpdate(req.params.id, req.body);
//         res.status(200).send(obj);
//       } catch (err) {
//         res.status(500).json({ message: err.message });
//       }
//     }
//     async deleteById(req: Request, res: Response) {
//       try {
//         const obj = await this.model.findByIdAndDelete(req.params.id);
//         res.status(200).send(obj);
//       } catch (err) {
//         res.status(500).json({ message: err.message });
//       }
//     }
//   }
// export default CommentController;
// import { Request, Response } from 'express';
// import CommentModel, { IComment } from '../models/comment_model';
// // Controller function to create a new comment
// export const createComment = async (req: Request, res: Response) => {
//   try {
//     const { postId, userId, content } = req.body;
//     // Create a new comment object
//     const newComment: IComment = new CommentModel({
//       postId,
//       userId,
//       content,
//     });
//     // Save the new comment to the database
//     const savedComment = await newComment.save();
//     res.status(201).json(savedComment);
//   } catch (error) {
//     res.status(500).json({ error: 'Unable to create comment' });
//   }
// };
// // Controller function to get comments for a specific post
// export const getCommentsByPostId = async (req: Request, res: Response) => {
//   try {
//     const postId = req.params.postId;
//     // Find all comments associated with the specified post ID
//     const comments = await CommentModel.find({ postId });
//     res.status(200).json(comments);
//   } catch (error) {
//     res.status(500).json({ error: 'Unable to get comments' });
//   }
// };
// // Controller function to update a comment
// export const updateComment = async (req: Request, res: Response) => {
//     try {
//       const commentId = req.params.commentId;
//       const { content } = req.body;
//       // Find the comment by ID and update its content
//       const updatedComment = await CommentModel.findByIdAndUpdate(
//         commentId,
//         { content },
//         { new: true } // Return the updated comment
//       );
//       if (!updatedComment) {
//         return res.status(404).json({ error: 'Comment not found' });
//       }
//       res.status(200).json(updatedComment);
//     } catch (error) {
//       res.status(500).json({ error: 'Unable to update comment' });
//     }
//   };
//   export const deleteComment = async (req: Request, res: Response) => {
//     try {
//       const commentId = req.params.commentId;
//       // Find the comment by ID and delete it
//       const deletedComment = await CommentModel.findByIdAndDelete(commentId);
//       if (!deletedComment) {
//         return res.status(404).json({ error: 'Comment not found' });
//       }
//       res.status(200).json({ message: 'Comment deleted successfully' });
//     } catch (error) {
//       res.status(500).json({ error: 'Unable to delete comment' });
//     }
//   };
//# sourceMappingURL=comment_controller.js.map