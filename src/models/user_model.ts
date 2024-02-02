import mongoose from "mongoose";

export interface IUser {
  fullName: string;
  email: string;
  password: string;
  _id?: string;
  refreshTokens?: string[];
  img_url: string;
}

const userSchema = new mongoose.Schema<IUser>({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshTokens: {
    type: [String],
    required: false,
  },
  img_url: {
    type: String
  },
  
});

export default mongoose.model<IUser>("User", userSchema);