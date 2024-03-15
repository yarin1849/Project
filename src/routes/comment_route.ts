import express from "express";
const router = express.Router();
import CommentController from "../controllers/comment_controller";
import authMiddleware from "../common/auth_middleware";

router.get("/:id", authMiddleware, CommentController.getById.bind(CommentController));
router.post("/", authMiddleware,CommentController.post.bind(CommentController));
router.get('/count/:id', CommentController.getCommentCount);

export default router;