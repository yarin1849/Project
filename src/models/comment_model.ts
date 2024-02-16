import mongoose, { Document } from "mongoose";

export interface IComment extends Document {
  user: mongoose.Schema.Types.ObjectId;
  content: string;
  createdAt: Date;
}

const commentSchema = new mongoose.Schema<IComment>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IComment>("Comment", commentSchema);
