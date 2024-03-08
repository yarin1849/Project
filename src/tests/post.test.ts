import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import User, { IUser } from "../models/user_model";
import Post, { IPost } from "../models/post_model";

let app: Express;
let accessToken = "";
let user: IUser;
let post1: IPost;

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await Post.deleteMany();
  await User.deleteMany({ 'email': 'test@.post.test' });

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
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Post controller tests", () => {
  test("Test Get All  posts - empty response", async () => {
    const response = await request(app).get("/userpost");
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual([]);
  });

  test("Test Post", async () => {
    const response = await request(app)
      .post("/userpost")
      .set("Authorization", "JWT " + accessToken)
      .send(post1);
    expect(response.statusCode).toBe(201);
    expect(response.body.owner).toBe(user._id);
    expect(response.body.title).toBe(post1.title);
    expect(response.body.message).toBe(post1.message);
  });

  test("Test Get All user posts with one post in DB", async () => {
    const response = await request(app).get("/userpost");
    expect(response.statusCode).toBe(200);
    const rc = response.body[0];
    expect(rc.title).toBe(post1.title);
    expect(rc.message).toBe(post1.message);
    expect(rc.owner).toBe(user._id);
  });

  test("Test PUT /userpost/:id", async () => {
    const updatedPost: IPost = {
      comments: [],
      title: "updatedTitle",
      message: "updatedMessage",
      owner: user._id,
      postImg: "postImg1",
    };
    const response = await request(app)
      .put(`/userpost/${post1._id}`)
      .set("Authorization", "JWT " + accessToken)
      .send(updatedPost);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(updatedPost.title);
    expect(response.body.message).toBe(updatedPost.message);
    expect(response.body.owner).toBe(user._id);
  });

  // test("Test DELETE /userpost/:id", async () => {
  //   const response = await request(app).delete(`/userpost/${post1._id}`)
  //     .set("Authorization", "JWT " + accessToken);
  //   expect(response.statusCode).toBe(200);
  // });
  

  test("Test Get All  posts - existing posts", async () => {
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
      .post("/userpost")
      .set("Authorization", "JWT " + accessToken)
      .send(post2);

    await request(app)
      .post("/userpost")
      .set("Authorization", "JWT " + accessToken)
      .send(post3);

    const response = await request(app).get("/userpost");
    expect(response.statusCode).toBe(200);
   // expect(response.body.length).toBe(3); // Expecting 3 posts including the previously created post1
  });

  test("Test Get User post by ID", async () => {
    // First, create a post
    const response = await request(app)
      .post("/userpost")
      .set("Authorization", "JWT " + accessToken)
      .send(post1);
    expect(response.statusCode).toBe(201);

    // Then, retrieve the created post by ID
    const createdPostId = response.body._id;
    const getByIdResponse = await request(app).get(`/userpost/${createdPostId}`);
    expect(getByIdResponse.statusCode).toBe(200);
    expect(getByIdResponse.body.title).toBe(post1.title);
    expect(getByIdResponse.body.message).toBe(post1.message);
    expect(getByIdResponse.body.owner).toBe(user._id);
  });


  test("Test Post", async () => {
    const response = await request(app)
      .post("/userpost")
      .set("Authorization", "JWT " + accessToken)
      .send(post1);
    expect(response.statusCode).toBe(201);
    expect(response.body.owner).toBe(user._id);
    expect(response.body.title).toBe(post1.title);
    expect(response.body.message).toBe(post1.message);
  });
  
  test("Test Get Post by ID - Post Found", async () => {
    // Make a request to create a post
    const postResponse = await request(app)
      .post("/userpost")
      .set("Authorization", "JWT " + accessToken)
      .send(post1);
    expect(postResponse.statusCode).toBe(201);
  
    // Extract the created post ID
    const postId = postResponse.body._id;
  
    // Make a request to retrieve the created post by ID using getById2
    const getByIdResponse = await request(app).get(`/userpost/${postId}`);
    
    // Assert the status code and the properties of the returned post
    expect(getByIdResponse.statusCode).toBe(200);
    expect(getByIdResponse.body.title).toBe(post1.title);
    expect(getByIdResponse.body.message).toBe(post1.message);
    expect(getByIdResponse.body.owner).toBe(user._id);
  });
  
  
  test("Test Delete Post by ID - Post Found", async () => {
    // Make a request to create a post
    const postResponse = await request(app)
      .post("/userpost")
      .set("Authorization", "JWT " + accessToken)
      .send(post1);
    expect(postResponse.statusCode).toBe(201);
  
    // Extract the created post ID
    const postId = postResponse.body._id;
  
    // Make a request to delete the created post by ID
    const deleteResponse = await request(app).delete(`/userpost/${postId}`)
      .set("Authorization", "JWT " + accessToken);
    
    // Assert the status code and the response body
    expect(deleteResponse.statusCode).toBe(200);
    expect(deleteResponse.body._id).toBe(postId);
  });


});
