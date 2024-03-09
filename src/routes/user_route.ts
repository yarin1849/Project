import express from "express";
const router = express.Router();
import UserController from "../controllers/user_controller";
import authMiddleware from "../common/auth_middleware";

/**
* @swagger
* tags:
*   name: Users
*   description: API endpoints for managing users
*/

/**
* @swagger
* components:
*   schemas:
*     User:
*       type: object
*       required:
*         - username
*         - email
*         - password
*       properties:
*         username:
*           type: string
*           description: The username of the user
*         email:
*           type: string
*           format: email
*           description: The email address of the user
*         password:
*           type: string
*           description: The password of the user
*       example:
*         username: 'john_doe'
*         email: 'john@example.com'
*         password: 'password123'
*/

router.get("/", authMiddleware, UserController.get.bind(UserController));

router.get("/:id", authMiddleware, UserController.getById.bind(UserController));

router.post("/", authMiddleware, UserController.post.bind(UserController));

router.put("/:id", authMiddleware, UserController.putById.bind(UserController));

router.delete("/:id", authMiddleware, UserController.deleteById.bind(UserController));

export default router;