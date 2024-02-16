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
exports.deleteComment = exports.updateComment = exports.getCommentsByPostId = exports.createComment = void 0;
const comment_model_1 = __importDefault(require("../models/comment_model"));
// Controller function to create a new comment
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId, userId, content } = req.body;
        // Create a new comment object
        const newComment = new comment_model_1.default({
            postId,
            userId,
            content,
        });
        // Save the new comment to the database
        const savedComment = yield newComment.save();
        res.status(201).json(savedComment);
    }
    catch (error) {
        res.status(500).json({ error: 'Unable to create comment' });
    }
});
exports.createComment = createComment;
// Controller function to get comments for a specific post
const getCommentsByPostId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.postId;
        // Find all comments associated with the specified post ID
        const comments = yield comment_model_1.default.find({ postId });
        res.status(200).json(comments);
    }
    catch (error) {
        res.status(500).json({ error: 'Unable to get comments' });
    }
});
exports.getCommentsByPostId = getCommentsByPostId;
// Controller function to update a comment
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentId = req.params.commentId;
        const { content } = req.body;
        // Find the comment by ID and update its content
        const updatedComment = yield comment_model_1.default.findByIdAndUpdate(commentId, { content }, { new: true } // Return the updated comment
        );
        if (!updatedComment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.status(200).json(updatedComment);
    }
    catch (error) {
        res.status(500).json({ error: 'Unable to update comment' });
    }
});
exports.updateComment = updateComment;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentId = req.params.commentId;
        // Find the comment by ID and delete it
        const deletedComment = yield comment_model_1.default.findByIdAndDelete(commentId);
        if (!deletedComment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.status(200).json({ message: 'Comment deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Unable to delete comment' });
    }
});
exports.deleteComment = deleteComment;
//# sourceMappingURL=comment_controller.js.map