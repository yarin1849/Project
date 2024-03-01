import mongoose, { ObjectId } from "mongoose";

export interface IComment {
  _id?: ObjectId;
  owner: string;
  content: string;
  postId?: ObjectId;
  createdAt: Date;
}

const commentSchema = new mongoose.Schema<IComment>({
  owner: {
    type: String,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  }
});

export default mongoose.model<IComment>("Comment", commentSchema);
