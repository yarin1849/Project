"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const review_controller_1 = __importDefault(require("../controllers/review_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: The Reviews API
 */
/**
 * @swagger
 * components:
 *  schemas:
 *   Review:
 *    type: object
 *   required:
 *   - trailId
 *  - userId
 * - rating
 * - comment
 *   properties:
 *    trailId:
 *    type: string
 *   description: The ID of the trail
 *   userId:
 *   type: string
 *  description: The ID of the user
 * rating:
 * type: number
 * description: The rating of the trail
 * comment:
 * type: string
 * description: The comment of the trail
 * example:
 * trailId: 5f4e3f3f3f3f3f3f3f3f3f3f
 * userId: 5f4e3f3f3f3f3f3f3f3f3f3f
 * rating: 5
 * comment: This trail is amazing!
 *  */
/**
 * @swagger
 * /reviews:
 *  get:
 *  summary: Returns the list of all the reviews
 * tags: [Reviews]
 * responses:
 * 200:
 * description: The list of the reviews
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Review'
 * */
router.get("/", review_controller_1.default.getAllReviews.bind(review_controller_1.default));
/**
 *  * @swagger
 * * /reviews/{id}:
 * * get:
 * * summary: Retrieve a single review by ID
 * * tags: [Reviews]
 * * parameters:
 * * - in: path
 * * name: id
 * * required: true
 * * schema:
 * * type: string
 * * description: The ID of the review
 * * responses:
 * * 200:
 * * description: A single review
 * * content:
 * * application/json:
 * * schema:
 * * $ref: '#/components/schemas/Review'
 * * 404:
 * * description: Review not found
 * */
router.get("/:id", review_controller_1.default.getReviewById.bind(review_controller_1.default));
/**
 * @swagger
 * /reviews:
 * post:
 * summary: Create a new review
 * tags: [Reviews]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Review'
 * responses:
 * 201:
 * description: Created
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Review'
 * 400:
 * description: Bad request
 * */
router.post("/", auth_middleware_1.default, review_controller_1.default.createReview.bind(review_controller_1.default));
/**
 * @swagger
 * /reviews/{id}:
 * put:
 * summary: Update a review
 * tags: [Reviews]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: The ID of the review
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Review'
 * responses:
 * 200:
 * description: The review
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Review'
 * 404:
 * description: Review not found
 * 400:
 * description: Bad request
 * */
router.put("/:id", auth_middleware_1.default, review_controller_1.default.updateReview.bind(review_controller_1.default));
/**
 * @swagger
 * /reviews/{id}:
 * delete:
 * summary: Delete a review
 * tags: [Reviews]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: The ID of the review
 * responses:
 * 204:
 * description: Review deleted
 * 404:
 * description: Review not found
 * 500:
 * description: Internal server error
 * */
router.delete("/:id", auth_middleware_1.default, review_controller_1.default.deleteReview.bind(review_controller_1.default));
exports.default = router;
//# sourceMappingURL=review_route.js.map