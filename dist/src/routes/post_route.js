"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const post_controller_1 = __importDefault(require("../controllers/post_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
/**
* @swagger
* tags:
*   name: Student Posts
*   description: API endpoints for managing student posts
*/
/**
* @swagger
* components:
*   schemas:
*     StudentPost:
*       type: object
*       required:
*         - title
*         - content
*       example:
*         title: 'Sample Title'
*         content: 'Sample content for the student post'
*/
/**
* @swagger
* /get:
*   get:
*     summary: Retrieve a list of all student posts
*     tags: [Student Posts]
*     responses:
*       200:
*         description: A list of student posts
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/StudentPost'
*/
router.get("/", post_controller_1.default.get.bind(post_controller_1.default));
/**
* @swagger
* /get/{id}:
*   get:
*     summary: Retrieve a single student post by ID
*     tags: [Student Posts]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: The ID of the student post
*     responses:
*       200:
*         description: The student get
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/StudentPost'
*       404:
*         description: Student post not found
*/
router.get("/:id", post_controller_1.default.getById.bind(post_controller_1.default));
/**
* @swagger
* /posts:
*   post:
*     summary: Create a new student post
*     tags: [Student Posts]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/StudentPost'
*     responses:
*       200:
*         description: The created student post
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/StudentPost'
*       401:
*         description: Unauthorized, authentication token is missing or invalid
*/
router.post("/", auth_middleware_1.default, post_controller_1.default.post.bind(post_controller_1.default));
/**
* @swagger
* /put/{id}:
*   put:
*     summary: Update an existing student post
*     tags: [Student Posts]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: The ID of the student post
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/StudentPost'
*     responses:
*       200:
*         description: The updated student post
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/StudentPost'
*       401:
*         description: Unauthorized, authentication token is missing or invalid
*       404:
*         description: Student post not found
*/
router.put("/:id", auth_middleware_1.default, post_controller_1.default.putById.bind(post_controller_1.default));
/**
* @swagger
* /delete/{id}:
*   delete:
*     summary: Delete a student post by ID
*     tags: [Student Posts]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: The ID of the student post
*     responses:
*       200:
*         description: Student post deleted successfully
*       401:
*         description: Unauthorized, authentication token is missing or invalid
*       404:
*         description: Student post not found
*/
router.delete("/:id", auth_middleware_1.default, post_controller_1.default.deleteById.bind(post_controller_1.default));
exports.default = router;
//# sourceMappingURL=post_route.js.map