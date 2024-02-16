import mongoose from "mongoose";

export interface IStudentPost {
  title: string;
  message: string;
  owner?: string;
}

const studentPostSchema = new mongoose.Schema<IStudentPost>({
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
});

export default mongoose.model<IStudentPost>("StudentPost", studentPostSchema);


/*
import mongoose from "mongoose";

export interface IStudentPost extends mongoose.Document {
  title: string;
  message: string;
  owner?: string;
  comments: Array<IComment>;
  likes: Array<ILike>;
}

export interface IComment {
  user: string; // Assuming user is identified by their ID
  content: string;
  createdAt: Date;
}

export interface ILike {
  user: string; // Assuming user is identified by their ID
}

const studentPostSchema = new mongoose.Schema<IStudentPost>({
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
  comments: [{
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
  }],
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }]
});

export default mongoose.model<IStudentPost>("StudentPost", studentPostSchema);
*/