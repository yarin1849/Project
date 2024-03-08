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
/**
 * @swagger
 * /users:
 *  get:
 *   summary: Retrieve a list of all users
 *  tags: [Users]
 * security:
 *  - bearerAuth: []
 *  responses:
 *   200:
 *   description: A list of users
 *  content:
 *  application/json:
 *  schema:
 *  type: array
 * items:
 * $ref: '#/components/schemas/User'
 */


router.get("/:id", authMiddleware, UserController.getById.bind(UserController));
/**
 * @swagger
 * /users/{id}:
 * get:
 * summary: Retrieve a single user by ID
 * tags: [Users]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: The ID of the user
 * responses:
 * 200:
 * description: The user
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/User'
 * 404:
 * description: User not found
 */


router.post("/", authMiddleware, UserController.post.bind(UserController));
router.post("/:id", authMiddleware, UserController.post.bind(UserController));

/**
 * @swagger
 * /users:
 * post:
 * summary: Create a new user
 * tags: [Users]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/User'
 * responses:
 * 200:
 * description: The user
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/User'
 * 400:
 * description: Invalid input
 * 401:
 * description: Unauthorized
 * 403:
 * description: Forbidden
 */

router.put("/", authMiddleware, UserController.putById2.bind(UserController));
/**
 * @swagger
 * /users:
 * put:
 * summary: Update a user by ID
 * tags: [Users]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:  
 * $ref: '#/components/schemas/User'
 * responses:
 * 200:
 * description: The updated user
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/User'
 * 400:
 * description: Invalid input
 * 401:
 * description: Unauthorized
 * 403:
 * description: Forbidden
 */

router.put("/:id", authMiddleware, UserController.putById2.bind(UserController));

/**
 * @swagger
 * /users/{id}:
 * put:
 * summary: Update a user by ID
 * tags: [Users]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: The ID of the user
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/User'
 * responses:
 * 200:
 * description: The updated user
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/User'
 * 400:
 * description: Invalid input
 * 401:
 * description: Unauthorized
 * 403:
 * description: Forbidden
 */
router.put("/:id", authMiddleware, UserController.putById.bind(UserController));

/**
 * @swagger
 * /users/{id}:
 * delete:
 * summary: Delete a user by ID
 * tags: [Users]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: The ID of the user
 * responses:
 * 200:
 * description: The deleted user
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/User'
 * 400:
 * description: Invalid input
 * 401:
 * description: Unauthorized
 * 403:
 * description: Forbidden
 */
router.delete("/:id", authMiddleware, UserController.deleteById.bind(UserController));
/**
 * @swagger
 * /users/{id}:
 * delete:
 * summary: Delete a user by ID
 * tags: [Users]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: The ID of the user
 * responses:
 * 200:
 * description: The deleted user
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/User'
 * 400:
 * description: Invalid input
 * 401:
 * description: Unauthorized
 * 403:
 * description: Forbidden
 */

export default router;