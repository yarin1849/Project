"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_controller_1 = __importDefault(require("../controllers/user_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
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
router.get("/", auth_middleware_1.default, user_controller_1.default.get.bind(user_controller_1.default));
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
router.get("/:id", auth_middleware_1.default, user_controller_1.default.getById.bind(user_controller_1.default));
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
router.post("/", auth_middleware_1.default, user_controller_1.default.post.bind(user_controller_1.default));
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
router.put("/", auth_middleware_1.default, user_controller_1.default.putById2.bind(user_controller_1.default));
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
router.put("/:id", auth_middleware_1.default, user_controller_1.default.putById2.bind(user_controller_1.default));
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
router.put("/:id", auth_middleware_1.default, user_controller_1.default.putById2.bind(user_controller_1.default));
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
router.delete("/:id", auth_middleware_1.default, user_controller_1.default.deleteById.bind(user_controller_1.default));
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
exports.default = router;
//# sourceMappingURL=user_route.js.map