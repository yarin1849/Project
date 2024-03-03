import mongoose, { ObjectId } from "mongoose";

export interface IReview {
    trailId: string;
    userId: string;
    rating: string;
    comment: string;
    _id?: string;
    }

const ReviewSchema = new mongoose.Schema<IReview>({
    trailId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    rating: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
});

export default mongoose.model<IReview>("Review", ReviewSchema);