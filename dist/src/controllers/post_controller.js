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
const post_model_1 = __importDefault(require("../models/post_model"));
//import Comment from "../models/comment_model";
const base_controller_1 = require("./base_controller");
class PostController extends base_controller_1.BaseController {
    constructor() {
        super(post_model_1.default);
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Get all Posts: ");
            try {
                const posts = yield post_model_1.default.find()
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
        });
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
    post(req, res) {
        const _super = Object.create(null, {
            post: { get: () => super.post }
        });
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Post: " + req.body);
            const userId = req.user._id;
            req.body.author = userId;
            _super.post.call(this, req, res);
        });
    }
    putById(req, res) {
        const _super = Object.create(null, {
            putById: { get: () => super.putById }
        });
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Put Post by Id:" + req.params.id);
            _super.putById.call(this, req, res);
        });
    }
    deleteById2(req, res) {
        const _super = Object.create(null, {
            deleteById: { get: () => super.deleteById }
        });
        return __awaiter(this, void 0, void 0, function* () {
            // try {
            //     await Comment.deleteMany({ postId: req.params.id });
            // } catch (error) {
            //     res.status(500).json({ message: "Could not delete " });
            // }
            // console.log("Delete Post by Id:" + req.params.id);
            _super.deleteById.call(this, req, res);
        });
    }
}
exports.default = new PostController();
//# sourceMappingURL=post_controller.js.map