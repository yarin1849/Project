"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const review_model_1 = __importDefault(require("../models/review_model"));
const base_controller_1 = require("./base_controller");
class ReviewController extends base_controller_1.BaseController {
    constructor() {
        super(review_model_1.default);
    }
    async getAllReviews(req, res) {
        try {
            const reviews = await review_model_1.default.find();
            res.status(200).json(reviews);
        }
        catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    // Get review by ID
    async getReviewById(req, res) {
        const { id } = req.params;
        try {
            const review = await review_model_1.default.findById(id);
            if (!review) {
                return res.status(404).json({ error: 'Review not found' });
            }
            res.status(200).json(review);
        }
        catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    // Create a new review
    async createReview(req, res) {
        const { trailId, userId, rating, comment } = req.body;
        // Check if rating is between 1 and 5
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }
        try {
            const stars = Array(rating).fill('★').join('');
            const review = await review_model_1.default.create({ trailId, userId, rating: stars, comment });
            res.status(201).json(review);
        }
        catch (error) {
            res.status(400).json({ error: 'Bad request' });
        }
    }
    // Update a review
    async updateReview(req, res) {
        const { id } = req.params;
        const { rating, comment } = req.body;
        // Check if rating is between 1 and 5
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }
        try {
            const stars = Array(rating).fill('★').join('');
            const updatedReview = await review_model_1.default.findByIdAndUpdate(id, { rating: stars, comment }, { new: true });
            if (!updatedReview) {
                return res.status(404).json({ error: 'Review not found' });
            }
            res.status(200).json(updatedReview);
        }
        catch (error) {
            res.status(400).json({ error: 'Bad request' });
        }
    }
    // Delete a review
    async deleteReview(req, res) {
        const { id } = req.params;
        try {
            const deletedReview = await review_model_1.default.findByIdAndDelete(id);
            if (!deletedReview) {
                return res.status(404).json({ error: 'Review not found' });
            }
            res.status(204).end();
        }
        catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
;
exports.default = new ReviewController();
//# sourceMappingURL=review_controller.js.map