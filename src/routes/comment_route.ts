import express from "express";
const router = express.Router();
import CommentController from "../controllers/comment_controller";
import authMiddleware from "../common/auth_middleware";

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: The Comments API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *      Comment:
 *        type: object
 *        properties:
 *          description:
 *            type: string
 *            description: The comment description
 *          author:
 *             type: string
 *             description: The comment's author id
 *          reviewId:
 *            type: string
 *            description: The comment reviewId
 *          timeStamp:
 *            type: string
 *            description: The comment upload time
 *        example:
 *          description: 'This is a great movie'
 *          author: '123456'
 *          reviewId: '123456'
 *          timeStamp: '2024-01-01T00:00:00.000Z'
 */

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       200:
 *         description: The comment was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Some parameters are missing or invalid
 *       401:
 *         description: Unauthorized, user needs to be signed in
 *       500:
 *         description: Unexpected error
 */

router.post(
  "/",
  authMiddleware,
  CommentController.post.bind(CommentController)
);

export default router;