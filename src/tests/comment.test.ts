import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import User, { IUser } from "../models/user_model";
import Post, { IPost } from "../models/post_model";
import Comment, { IComment } from "../models/comment_model";
import { Express } from "express";

let app: Express;
let accessToken
let user: IUser;
let post1: IPost;
let comment1: IComment;

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await Post.deleteMany();
  await User.deleteMany({ 'email': 'test@.post.test' });
  await Comment.deleteMany({});

  // Register a user
  const registerResponse = await request(app).post("/auth/register").send({
    name: "bla",
    email: "test@.post.test",
    password: "1234567890",
  });
  user = registerResponse.body;

  // Login to get the access token
  const loginResponse = await request(app).post("/auth/login").send({
    email: user.email,
    password: "1234567890",
  });
  accessToken = loginResponse.body.accessToken;

  // Create a post
post1 = {
    comments: [],
    title: "title1",
    message: "message1",
    owner: user._id,
    postImg: "postImg1",
};

// Create a comment
comment1 = {
    content: "comment1",
    owner: "1234567890",
    createdAt: new Date(),
};
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Comment controller tests", () => {
  test("Test Get All comments - empty response", async () => {
    const response = await request(app).get("/comment");
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual([]);
  });

  test("Test Post", async () => {
    const response = await request(app)
      .post("/comment")
      .set("Authorization", "JWT " + accessToken)
      .send(comment1);
    expect(response.statusCode).toBe(201);
  });

  test("Test Get All comments - response with one comment", async () => {
    const response = await request(app).get("/comment");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
  });

  test("Test Get comment by ID", async () => {
    const response = await request(app).get("/comment");
    const comment = response.body[0];
    const response2 = await request(app).get("/comment/" + comment._id);
    expect(response2.statusCode).toBe(200);
    expect(response2.body.message).toBe(comment1.content);
  });

  test("Test Put comment by ID", async () => {
    const response = await request(app).get("/comment");
    const comment = response.body[0];
    const response2 = await request(app)
      .put("/comment/" + comment._id)
      .set("Authorization", "JWT " + accessToken)
      .send({ message: "new comment" });
    expect(response2.statusCode).toBe(200);
    expect(response2.body.message).toBe("new comment");
  });

  test("Test Delete comment by ID", async () => {
    const response = await request(app).get("/comment");
    const comment = response.body[0];
    const response2 = await request(app)
      .delete("/comment/" + comment._id)
      .set("Authorization", "JWT " + accessToken);
    expect(response2.statusCode).toBe(200);
    expect(response2.body.message).toBe(comment1.content);
  });
});