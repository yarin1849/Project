"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_controller_1 = __importDefault(require("../controllers/user_controller"));
//import authMiddleware from "../common/auth_middleware";
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
router.get("/", user_controller_1.default.get.bind(user_controller_1.default));
router.get("/:id", user_controller_1.default.getById.bind(user_controller_1.default));
router.post("/", user_controller_1.default.post.bind(user_controller_1.default));
router.put("/:id", user_controller_1.default.putById.bind(user_controller_1.default));
router.delete("/:id", user_controller_1.default.deleteById.bind(user_controller_1.default));
exports.default = router;
//# sourceMappingURL=user_route.js.map