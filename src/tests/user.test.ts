import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import { Express } from "express";
import User, { IUser } from "../models/user_model";

let app: Express;
let accessToken: string;
let user: IUser;

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await User.deleteMany();

  // Register a user and obtain the access token
  user = {
    name: "Joe 123",
    email: "abc@test.com",
    password: "A00000000"
  };
  await request(app).post("/auth/register").send(user);
  const response = await request(app).post("/auth/login").send(user);
  accessToken = response.body.accessToken;
});

afterAll(async () => {
  await User.deleteMany();
  await mongoose.connection.close();
});

describe("Users tests", () => {
  test("Test Get current user", async () => {
    const response = await request(app)
      .get("/user")
      .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(user.name);
    expect(response.body.email).toBe(user.email);
  });

  test("Test POST /user", async () => {
    const newUser: IUser = {
      name: "Alice",
      email: "alice@test.com",
      password: "password123"
    };
    const response = await request(app)
      .post("/user")
      .set("Authorization", "JWT " + accessToken)
      .send(newUser);
    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe(newUser.name);
    expect(response.body.email).toBe(newUser.email);
  });

  test("Test POST /user with invalid data", async () => {
    const invalidUser: IUser = {
      name: "Bob", // Missing email and password
      email: '',
      password: ''
    };
    const response = await request(app)
      .post("/user")
      .set("Authorization", "JWT " + accessToken)
      .send(invalidUser);
    expect(response.statusCode).toBe(406);
    expect(response.text).toContain("fail");
  });
  test("Test DELETE /user/:id", async () => {
    // Add the user to the database
    const response = await request(app)
      .post("/user")
      .send(user);
      //UnAothorized - no token
    expect(response.statusCode).toBe(401);
  });
  
  test("Test Non-existent User Delete", async () => {
    // Delete a non-existent user with an invalid ID
    const response = await request(app)
      .delete("/user/invalid_id")
      .set("Authorization", "JWT " + accessToken);
    
    expect(response.statusCode).toBe(500);
  });
  test("Test Non-existent User PUT", async () => {
    // Delete a non-existent user with an invalid ID
    const response = await request(app)
      .put("/user/invalid_id")
      .set("Authorization", "JWT " + accessToken);
    
    expect(response.statusCode).toBe(500);
  });

  
});




// import request from "supertest";
// import initApp from "../app";
// import mongoose from "mongoose";
// //import user from "../models/user_model";
// import { Express } from "express";
// import Users from "../models/user_model";
// import User, { IUser } from "../models/user_model";

// let app: Express;
// let accessToken: string;
// /*const user = {
//   email: "testuser@test.com",
//   password: "1234567890",
// }*/
// beforeAll(async () => {
//   app = await initApp();
//   console.log("beforeAll");
//   await Users.deleteMany();
//   User.deleteMany({ 'email': user.email });
//   await request(app).post("/auth/register").send(user);
//   const response = await request(app).post("/auth/login").send(user);
//   accessToken = response.body.accessToken;
// });

// afterAll(async () => {
//   User.deleteMany({ 'email': user.email });
//   await mongoose.connection.close();
// });

// const user: IUser = {
//   name: "Joe 123",
//   email: "abc@test.com",
//   password: "A00000000"
// };

// describe("Users tests", () => {
 
//   test("Test Get current user", async () => {
//     const response = await request(app)
//       .get("/user")
//       .set("Authorization", "JWT " + accessToken);
//     expect(response.statusCode).toBe(200);
//     expect(response.body.name).toBe(user.name);
//     expect(response.body.email).toBe(user.email);
//   });
  

//   test("Test Post user", async () => {
//     const response = await request(app)
//       .post("/user")
//       .set("Authorization", "JWT " + accessToken)
//       .send(user);
//     expect(response.statusCode).toBe(201);
//     expect(response.body.name).toBe(user.name);
//     expect(response.body.email).toBe(user.email);
//     expect(response.body._id).toBe(user._id);
//   });
 
 
//   test("Test Post duplicate user", async () => {
//     const response = await request(app)
//       .post("/user")
//       .set("Authorization", "JWT " + accessToken)
//       .send(user);
//     expect(response.statusCode).toBe(406);
//   });
//   test("Test Update current user", async () => {
//     const updatedUserData: IUser = {
//       name: "Updated Name",
//       email: "updated@test.com",
//       password: "A00000000",
//     };
  
//     const response = await request(app)
//       .put("/user") // Assuming the endpoint is correct
//       .set("Authorization", "JWT " + accessToken)
//       .send(updatedUserData);
  
//     expect(response.statusCode).toBe(200);
//     expect(response.body.name).toBe(updatedUserData.name);
//     expect(response.body.email).toBe(updatedUserData.email);
  
//     // Verify that the user data is updated in the database
//     const updatedUser = await User.findOne({ email: updatedUserData.email });
//     expect(updatedUser).not.toBeNull();
//     expect(updatedUser!.name).toBe(updatedUserData.name);
//   });
  
//   test("Test DELETE /user/:id", async () => {
//     // Add the user to the database
//     const response = await request(app)
//       .post("/user")
//       .send(user);
//       //UnAothorized - no token
//     expect(response.statusCode).toBe(401);
//   });
  

  
// });
