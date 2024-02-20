import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import StudentPost, { IStudentPost } from "../models/post_model";
import User, { IUser } from "../models/user_model";

const user: IUser = {
  name: "bla",
  email: "testStudent@test.com",
  password: "1234567890",
}
let accessToken: string;
let app: Express;
beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await StudentPost.deleteMany();
  await User.deleteMany({ 'email': user.email });

});

afterAll(async () => {
  await mongoose.connection.close();
});

const post1: IStudentPost = {
  _id: 1,
  title: "title1",
  message: "message1",
};

describe("Student post tests", () => {
  const addStudentPost = async (post: IStudentPost) => {
    const response = await request(app)
      .post("/studentpost")
      .set("Authorization", "JWT " + accessToken)
      .send(post);
    expect(response.statusCode).toBe(201);
    expect(response.text).toBe("OK");
  };

  test("Get token", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send(user);
    user._id = response.body._id;
    const response2 = await request(app)
      .post("/auth/login")
      .send(user);
    accessToken = response2.body.accessToken;
    expect(accessToken).toBeDefined();
  });

  test("Test Get All Student posts - empty response", async () => {
    const response = await request(app)
      .get("/studentpost")
      .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual([]);
  });

  test("Test Post Student post", async () => {
    addStudentPost(post1);
  });

  test("Test Get All Students posts with one post in DB", async () => {
    const response = await request(app).get("/studentpost")
      .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    const rc = response.body[0];
    expect(rc.title).toBe(post1.title);
    expect(rc.message).toBe(post1.message);
    expect(rc.owner).toBe(user._id);
  });

  test("Test PUT /studentpost/:id", async () => {
    const updatedPost: IStudentPost = {
      _id: 1,
      title: "updatedTitle",
      message: "updatedMessage",
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
});

test("Test Post duplicate Student post", async () => {
  const response = await request(app).post("/studentpost")
    .set("Authorization", "JWT " + accessToken)
    .send(post1);
  expect(response.statusCode).toBe(406);
});

test("Test forbidden access without token", async () => {
  const response = await request(app).get("/studentpost");
  expect(response.statusCode).toBe(200);
});

test("Test access with invalid token", async () => {
  const response = await request(app)
    .get("/studentpost")
    .set("Authorization", "JWT 1" + accessToken);
  expect(response.statusCode).toBe(200);
});