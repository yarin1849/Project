import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import User, { IUser } from "../models/user_model";
import StudentPost, { IStudentPost } from "../models/post_model";

let app: Express;
let accessToken = "";
let user: IUser;
let post1: IStudentPost;

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await StudentPost.deleteMany();
  await User.deleteMany({ 'email': 'test@student.post.test' });

  // Register a user
  const registerResponse = await request(app).post("/auth/register").send({
    name: "bla",
    email: "test@student.post.test",
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
    title: "title1",
    message: "message1",
    owner: user._id,
  };
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Student post controller tests", () => {
  test("Test Get All Student posts - empty response", async () => {
    const response = await request(app).get("/studentpost");
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual([]);
  });

  test("Test Post Student post", async () => {
    const response = await request(app)
      .post("/studentpost")
      .set("Authorization", "JWT " + accessToken)
      .send(post1);
    expect(response.statusCode).toBe(201);
    expect(response.body.owner).toBe(user._id);
    expect(response.body.title).toBe(post1.title);
    expect(response.body.message).toBe(post1.message);
  });

  test("Test Get All Students posts with one post in DB", async () => {
    const response = await request(app).get("/studentpost");
    expect(response.statusCode).toBe(200);
    const rc = response.body[0];
    expect(rc.title).toBe(post1.title);
    expect(rc.message).toBe(post1.message);
    expect(rc.owner).toBe(user._id);
  });

  test("Test PUT /studentpost/:id", async () => {
    const updatedPost: IStudentPost = {
      title: "updatedTitle",
      message: "updatedMessage",
      owner: user._id,
    };
    const response = await request(app)
      .put(`/studentpost/${post1._id}`)
      .set("Authorization", "JWT " + accessToken)
      .send(updatedPost);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(updatedPost.title);
    expect(response.body.message).toBe(updatedPost.message);
    expect(response.body.owner).toBe(user._id);
  });

  test("Test DELETE /studentpost/:id", async () => {
    const response = await request(app).delete(`/studentpost/${post1._id}`)
      .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).toBe(200);
  });

  test("Test Get All Student posts - existing posts", async () => {
    // Create some posts
    const post2 = {
      title: "title2",
      message: "message2",
      owner: user._id,
    };
    const post3 = {
      title: "title3",
      message: "message3",
      owner: user._id,
    };

    await request(app)
      .post("/studentpost")
      .set("Authorization", "JWT " + accessToken)
      .send(post2);

    await request(app)
      .post("/studentpost")
      .set("Authorization", "JWT " + accessToken)
      .send(post3);

    const response = await request(app).get("/studentpost");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(3); // Expecting 3 posts including the previously created post1
  });

  test("Test Get Student post by ID", async () => {
    // First, create a post
    const response = await request(app)
      .post("/studentpost")
      .set("Authorization", "JWT " + accessToken)
      .send(post1);
    expect(response.statusCode).toBe(201);

    // Then, retrieve the created post by ID
    const createdPostId = response.body._id;
    const getByIdResponse = await request(app).get(`/studentpost/${createdPostId}`);
    expect(getByIdResponse.statusCode).toBe(200);
    expect(getByIdResponse.body.title).toBe(post1.title);
    expect(getByIdResponse.body.message).toBe(post1.message);
    expect(getByIdResponse.body.owner).toBe(user._id);
  });
});
