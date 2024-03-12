"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const post_model_1 = __importDefault(require("../models/post_model"));
//import Comment from "../models/comment_model";
const base_controller_1 = require("./base_controller");
class PostController extends base_controller_1.BaseController {
    constructor() {
        super(post_model_1.default);
    }
    async get(req, res) {
        console.log("Get all Posts: ");
        try {
            const posts = await post_model_1.default.find()
                .select([
                "title",
                "message",
                "owner",
                "_id",
                "comments",
                "postImg",
            ])
                .populate([{ path: "owner", select: "name imgUrl" }])
                .sort({ timeStamp: -1 });
            const detailedPosts = posts
                .map((post) => post.toObject());
            res.send(detailedPosts);
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    async getPostById(postId) {
        try {
            const post = await post_model_1.default.findById(postId);
            if (post) {
                const postData = {
                    title: post.title,
                    message: post.message,
                    owner: post.owner,
                    _id: post._id.toString(),
                    comments: post.comments, // Assuming comments are already populated
                    postImg: post.postImg // Assigning the URL of the image
                };
                return postData;
            }
            else {
                return null; // Post not found
            }
        }
        catch (error) {
            console.error('Error fetching post:', error);
            throw error;
        }
    }
    // async getById2(req: AuthRequest, res: Response) {
    //     console.log("Get Post by Id:" + req.params.id);
    //     try {
    //         const post = await Post.findById(req.params.id)
    //             .populate([{ path: "owner", select: "name imgUrl" }])
    //             .populate({
    //                 path: "comments",
    //                 select: "description owner",
    //                 populate: { path: "owner", select: "name imgUrl" },
    //             });
    //         if (!post) {
    //             return res.status(404).json({ message: "Post not found" }); // Return early if post is not found
    //         }
    //         console.log(post);
    //         return res.status(201).send(post); // Send the post if found
    //     } catch (error) {
    //         console.error(error);
    //         return res.status(500).json({ message: "Internal server error" }); // Send a generic error message
    //     }
    // }
    async post(req, res) {
        console.log("Post: " + req.body);
        const userId = req.user._id;
        req.body.author = userId;
        super.post(req, res);
    }
}
exports.default = new PostController();
//# sourceMappingURL=post_controller.js.map