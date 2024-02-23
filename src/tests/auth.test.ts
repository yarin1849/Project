import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import { Express } from "express";
import User from "../models/user_model";

let app: Express;
const user = {
  email: "testUser@test.com",
  password: "1234567890",
}

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await User.deleteMany({ 'email': user.email });
});

afterAll(async () => {
  await mongoose.connection.close();
});

let accessToken: string;
let refreshToken: string;
let newRefreshToken: string

describe("Auth tests", () => {
  test("Test Register", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send(user);
    expect(response.statusCode).toBe(201);
  });

  test("Test Register exist email", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send(user);
    expect(response.statusCode).toBe(406);
  });

  test("Test Register missing password", async () => {
    const response = await request(app)
      .post("/auth/register").send({
        email: "test@test.com",
      });
    expect(response.statusCode).toBe(400);
  });

  test("Test Login", async () => {
    const response = await request(app)
      .post("/auth/login").send(user);
    expect(response.statusCode).toBe(200);
    accessToken = response.body.accessToken;
    refreshToken = response.body.refreshToken;
    expect(accessToken).toBeDefined();
  });

  test("Test forbidden access without token", async () => {
    const response = await request(app).get("/user");
    expect(response.statusCode).toBe(401);
  });

  test("Test access with valid token", async () => {
    const response = await request(app)
      .get("/user")
      .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).toBe(200);
  });

  test("Test access with invalid token", async () => {
    const response = await request(app)
      .get("/user")
      .set("Authorization", "JWT 1" + accessToken);
    expect(response.statusCode).toBe(401);
  });

  jest.setTimeout(10000);

  test("Test access after timeout of token", async () => {
    await new Promise(resolve => setTimeout(() => resolve("done"), 5000));

    const response = await request(app)
      .get("/user")
      .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).not.toBe(200);
  });

  test("Test refresh token", async () => {
    const response = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "JWT " + refreshToken)
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();

    const newAccessToken = response.body.accessToken;
    newRefreshToken = response.body.refreshToken;

    const response2 = await request(app)
      .get("/user")
      .set("Authorization", "JWT " + newAccessToken);
    expect(response2.statusCode).toBe(200);
  });

  test("Test double use of refresh token", async () => {
    const response = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "JWT " + refreshToken)
      .send();
    expect(response.statusCode).not.toBe(200);

    //verify that the new token is not valid as well
    const response1 = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "JWT " + newRefreshToken)
      .send();
    expect(response1.statusCode).not.toBe(200);
  });

  // Additional tests
  test("Test invalid email format", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({
        email: "invalidEmail",
        password: "1234567890",
      });
    expect(response.statusCode).toBe(400);
  });

  test("Test invalid password length", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({
        email: "test@test.com",
        password: "123",
      });
    expect(response.statusCode).toBe(400);
  });

  test("Test missing email in login", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        password: "1234567890",
      });
    expect(response.statusCode).toBe(400);
  });

  test("Test missing password in login", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "test@test.com",
      });
    expect(response.statusCode).toBe(400);
  });

  // New tests
  test("Test invalid email format in registration", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({
        email: "invalidEmail",
        password: "1234567890",
      });
    expect(response.statusCode).toBe(400);
  });

  test("Test invalid password length in registration", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({
        email: "test@test.com",
        password: "123",
      });
    expect(response.statusCode).toBe(400);
  });

  test("Test missing email in registration", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({
        password: "1234567890",
      });
    expect(response.statusCode).toBe(400);
  });

  test("Test missing password in registration", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({
        email: "test@test.com",
      });
    expect(response.statusCode).toBe(400);
  });

  test("Test invalid email format in login", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "invalidEmail",
        password: "1234567890",
      });
    expect(response.statusCode).toBe(400);
  });

  test("Test missing email in login", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        password: "1234567890",
      });
    expect(response.statusCode).toBe(400);
  });

  test("Test missing password in login", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "test@test.com",
      });
    expect(response.statusCode).toBe(400);
  });
});

afterAll(async () => {
  // Close the database connection
  await mongoose.connection.close();
});

describe("Auth tests", () => {
  test("Test Login", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send(user);
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    accessToken = response.body.accessToken;
    refreshToken = response.body.refreshToken;
  });

  test("Test Refresh Token", async () => {
    const response = await request(app)
      .post("/auth/refresh-token")
      .send({ refreshToken });
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    accessToken = response.body.accessToken;
    newRefreshToken = response.body.refreshToken;
  });

  test("Test Logout", async () => {
    const response = await request(app)
      .get("/auth/logout")
      .set("Authorization", "Bearer " + accessToken);
    expect(response.statusCode).toBe(200);
    const response2 = await request(app)
      .get("/user")
      .set("Authorization", "Bearer " + accessToken);
    expect(response2.statusCode).toBe(401);
  });

  test("Test User Profile", async () => {
    const response = await request(app)
      .get("/user/profile")
      .set("Authorization", "Bearer " + accessToken);
    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe(user.email);
  });
});