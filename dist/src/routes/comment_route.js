"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const comment_controller_1 = __importDefault(require("../controllers/comment_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
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
router.post("/", auth_middleware_1.default, comment_controller_1.default.post.bind(comment_controller_1.default));
exports.default = router;
//# sourceMappingURL=comment_route.js.map