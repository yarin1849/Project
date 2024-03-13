"use strict";
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
    async post(req, res) {
        try {
            const userId = req.user._id;
            const { content, postId } = req.body;
            const postFind = await post_model_1.default.findById(postId);
            if (!postFind) {
                res.status(404).json({ message: "post not found" });
                return;
            }
            const comment = await comment_model_1.default.create({
                content,
                owner: userId,
                postId: postFind.id,
            });
            postFind.comments.push(comment.id);
            await postFind.save();
            res.status(201).json(comment);
        }
        catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}
exports.default = new CommentController();
//# sourceMappingURL=comment_controller.js.map