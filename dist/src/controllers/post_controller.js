"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const post_model_1 = __importDefault(require("../models/post_model"));
const comment_model_1 = __importDefault(require("../models/comment_model"));
const base_controller_1 = require("./base_controller");
class PostController extends base_controller_1.BaseController {
    constructor() {
        super(post_model_1.default);
    }
    async post(req, res) {
        console.log("Post: " + req.body);
        const userId = req.user._id;
        req.body.owner = userId;
        super.post(req, res);
    }
    async deleteById(req, res) {
        try {
            await comment_model_1.default.deleteMany({ reviewId: req.params.id });
        }
        catch (error) {
            res.status(500).json({ message: "Could not delete comments" });
        }
        console.log("Delete Post by Id:" + req.params.id);
        super.deleteById(req, res);
    }
    async putById2(req, res) {
        console.log("Put Post by Id:" + req.params.id);
        super.putById(req, res);
    }
    async getByUserId(req, res) {
        try {
            const userId = req.query.userId;
            const obj = await this.model.find({ owner: userId });
            res.status(200).json(obj);
        }
        catch (err) {
            res.status(406).send("fail: " + err.message);
        }
    }
    async getById(req, res) {
        console.log("Get Post by Id:" + req.params.id);
        try {
            const p = await post_model_1.default.findById(req.params.id)
                .populate([{ path: "owner", select: "name imgUrl" }])
                .populate({
                path: "comments",
                select: "message title owner postId",
                populate: { path: "owner", select: "name imgUrl" },
            });
            if (!p) {
                res.status(404).json({ message: "Post not found" });
            }
            console.log(p);
            res.status(201).send(p);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    }
}
exports.default = new PostController();
// import Post, { IPost } from "../models/post_model";
// import Comment from "../models/comment_model";
// import { BaseController } from "./base_controller";
// import { Response } from "express";
// import { AuthRequest } from "../common/auth_middleware";
// class PostController extends BaseController<IPost> {
//     constructor() {
//         super(Post);
//     }
//     async post(req: AuthRequest, res: Response) {
//         console.log("Post: " + req.body);
//         const userId = req.user._id;
//         req.body.owner = userId;
//         super.post(req, res);
//     }
//     async deleteById(req: AuthRequest, res: Response) {
//         try {
//           await Comment.deleteMany({ reviewId: req.params.id });
//         } catch (error) {
//           res.status(500).json({ message: "Could not delete comments" });
//         }
//         console.log("Delete Post by Id:" + req.params.id);
//         super.deleteById(req, res);
//       }
//     async putById2(req: AuthRequest, res: Response) {
//         console.log("Put Post by Id:" + req.params.id);
//         super.putById(req, res);
//     }
//     async getByUserId(req: AuthRequest, res: Response) {
//       try {
//         const userId = req.query.userId;
//         const obj = await this.model.find({owner : userId});
//         res.status(200).json(obj);
//       } catch (err) {
//         res.status(406).send("fail: " + err.message);
//       }
//     }
//     async getById(req: AuthRequest, res: Response) {
//       console.log("Get Post by Id:" + req.params.id);
//       try {
//         const p = await Post.findById(req.params.id)
//           .populate([{ path: "owner", select: "name imgUrl" }])
//           .populate({
//             path: "comments",
//             select: "message title owner postId",
//             populate: { path: "owner", select: "name imgUrl" },
//           });
//         if (!p) {
//           res.status(404).json({ message: "Post not found" });
//         }
//         console.log(p);
//         res.status(201).send(p);
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: error.message });
//       }
//     }
// }
// export default new PostController();
//# sourceMappingURL=post_controller.js.map