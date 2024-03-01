import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import { Express } from "express";
import User from "../models/user_model";
import jwt from 'jsonwebtoken';
// import jwt from 'jsonwebtoken'; // Import jsonwebtoken library

// // Add the generateValidRefreshToken function here
// const generateValidRefreshToken = async () => {
//   // Assuming you have access to the user's ID or any unique identifier
//   const userId = user._id; // Replace with the actual user ID
  
//   // Sign a refresh token with the user's ID as the payload
//   const refreshToken = jwt.sign({ _id: userId }, process.env.JWT_REFRESH_SECRET);
  
//   return refreshToken;
// };

let app: Express;
const user = {
  _id : "1234",
  name: "user1",
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

  test("Test invalid email format", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({
        email: "", // Invalid email format (missing @)
        password: "1234567890",
      });
    expect(response.statusCode).toBe(400);
  });
  
  test("Test invalid password length (empty password)", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({
        email: "test@test.com",
        password: "", // Invalid password length (empty password)
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
  // test("Test missing name in registration", async () => {
  //   const response = await request(app)
  //     .post("/auth/register")
  //     .send({
  //       email: "test@test.com",
  //       password: "1234567890",
  //     });
  //   expect(response.statusCode).toBe(400);
  // });
  test("Test missing name in registration", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({
        email: "test@test.com",
        password: "1234567890",
      });
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("missing email or password");
  });
    test("Test Login with incorrect email", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "incorrectemail@test.com", // Incorrect email
          password: "1234567890", // Correct password
        });
      expect(response.statusCode).toBe(401);
      expect(response.text).toBe("email or password incorrect");
    });
    
    test("Test Login with incorrect password", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "test@test.com", // Correct email
          password: "incorrectpassword", // Incorrect password
        });
      expect(response.statusCode).toBe(401);
      expect(response.text).toBe("email or password incorrect");
    });
    
    test("Test Logout with missing refresh token", async () => {
      const response = await request(app)
        .get("/auth/logout");
      expect(response.statusCode).toBe(401);
    });
    
    test("Test Logout with invalid refresh token", async () => {
      const invalidRefreshToken = "invalid_refresh_token";
      const response = await request(app)
        .get("/auth/logout")
        .set("Authorization", "JWT " + invalidRefreshToken);
      expect(response.statusCode).toBe(401);
    });
    

  test("Test Register missing name", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({
        email: "test@test.com",
        password: "1234567890",
      });
    expect(response.statusCode).toBe(400);
  });
  test("Test Login with missing email", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        password: "1234567890",
      });
    expect(response.statusCode).toBe(400);
  });
  test("Test Login with missing password", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "test@test.com",
      });
    expect(response.statusCode).toBe(400);
  });
  test("Test refresh token with missing token", async () => {
    const response = await request(app)
      .get("/auth/refresh");
    expect(response.statusCode).toBe(401);
  });
  test("Test refresh token with invalid token", async () => {
    const invalidRefreshToken = "invalid_refresh_token";
    const response = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "JWT " + invalidRefreshToken);
    expect(response.statusCode).toBe(401);
  });
  test("Test refresh token with valid token but not in database", async () => {
    const validRefreshToken = jwt.sign({ _id: "non_existing_user_id" }, process.env.JWT_REFRESH_SECRET);
    const response = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "JWT " + validRefreshToken);
    expect(response.statusCode).toBe(401);
  });
  test("Test Login with non-existent email", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "nonexistent@test.com",
        password: "1234567890",
      });
    expect(response.statusCode).toBe(401);
  });

  test("Test Login with incorrect password", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "test@test.com",
        password: "incorrectpassword",
      });
    expect(response.statusCode).toBe(401);
    expect(response.text).toBe("email or password incorrect");

  });

  test("Test Register with valid name, email, and password", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({
        name: "John Doe",
        email: "johndoe@test.com",
        password: "1234567890",
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");
  });
});


