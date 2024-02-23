import express from "express";
const router = express.Router();
import studentPostController from "../controllers/post_controller";
import authMiddleware from "../common/auth_middleware";

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
router.get("/", studentPostController.get.bind(studentPostController));

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
router.get("/:id", studentPostController.getById.bind(studentPostController));

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
router.post("/", authMiddleware, studentPostController.post.bind(studentPostController));

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
router.put("/:id", authMiddleware, studentPostController.putById.bind(studentPostController));

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

router.delete("/:id", authMiddleware, studentPostController.deleteById.bind(studentPostController));

export default router;