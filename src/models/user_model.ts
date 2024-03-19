import mongoose, { ObjectId } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  imgUrl?: string;
  _id?: ObjectId;
  refreshTokens?: string[];
  latitude?: number; // New field for latitude
  longitude?: number; // New field for longitude
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
  },
  refreshTokens: {
    type: [String],
    required: false,
  },
  latitude: {
    type: Number, // Define type for latitude
  },
  longitude: {
    type: Number, // Define type for longitude
  },
});

export default mongoose.model<IUser>("User", userSchema);
