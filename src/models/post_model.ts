import mongoose, { ObjectId } from "mongoose";

export interface IPost {
  title: string;
  message: string;
  owner?: string;
  _id?: number;
  comments: ObjectId[];
}

const PostSchema = new mongoose.Schema<IPost>({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  comments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Comment",
    default: [],
    required: true,
  },
});

export default mongoose.model<IPost>("Post", PostSchema);