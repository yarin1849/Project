import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import { IComment } from "../models/comment_model";
import User, { IUser } from "../models/user_model";
import Review, { IPost } from "../models/post_model";

let app: Express;
let accessToken = "";

const user: IUser = {
  name: "John Doe",
  email: "john@student.com",
  password: "1234567890",
  imgUrl: "https://www.google.com",
};

const review: IPost = {
  title: "Test Movie",
  message: "Test Description",
  postImg: "https://www.google.com",
  comments: [],
  owner: user._id,
};

const comment: IComment = {
  content: "test description",
  owner: user._id,
  postId: review._id,
  createdAt: new Date(),
};

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");

  await User.deleteMany({ email: user.email });
  const response = await request(app).post("/auth/register").send(user);
  user._id = response.body._id;
  accessToken = response.body.accessToken;
  const postedUser = await User.findOne({ email: user.email });
  user._id = postedUser.id;
  review.owner = postedUser.id;
  comment.owner = postedUser.id;
  const postedReview = await Review.create(review);
  review._id = postedReview._id;
  comment.postId = postedReview._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Post comment test", () => {
  const addComment = async (comment: IComment) => {
    const response = await request(app)
      .post("/comments")
      .set("Authorization", "JWT " + accessToken)
      .send(comment);
      expect(response.statusCode).toBe(201);
      expect(response.body.owner).toBe(user._id);
      expect(response.body.content).toBe(comment.content);
      expect(response.body.postId).toBe(review._id.toString());
  };

  test("Test post", async () => {
    await addComment(comment);
  });

  test("Test posting a comment to a non-existent post", async () => {
    // Create a comment object with a postId that does not exist
    const invalidComment: IComment = {
      content: "test description",
      owner: user._id,
      postId: user._id,// not post id so should fail
      createdAt: new Date(),
    };
  
    // Make a request to post the comment
    const response = await request(app)
      .post("/comments")
      .set("Authorization", "JWT " + accessToken)
      .send(invalidComment);
  
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("post not found");
  });
  test("Test posting a comment with internal server error", async () => {
    const invalidComment = { ...comment, postId: "invalid_post_id" };
  
    const response = await request(app)
      .post("/comments") 
      .set("Authorization", "JWT " + accessToken)
      .send(invalidComment); 
  
    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Internal Server Error");
  });
  
 
});

