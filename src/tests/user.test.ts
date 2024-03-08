import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
//import user from "../models/user_model";
import { Express } from "express";
import Users from "../models/user_model";
import User, { IUser } from "../models/user_model";

let app: Express;
let accessToken: string;
/*const user = {
  email: "testuser@test.com",
  password: "1234567890",
}*/
beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await Users.deleteMany();
  User.deleteMany({ 'email': user.email });
  await request(app).post("/auth/register").send(user);
  const response = await request(app).post("/auth/login").send(user);
  accessToken = response.body.accessToken;
});

afterAll(async () => {
  User.deleteMany({ 'email': user.email });
  await mongoose.connection.close();
});

const user: IUser = {
  name: "Joe 123",
  _id : "33",
  email: "abc@test.com",
  password: "A00000000"
};

describe("Users tests", () => {
 
  test("Test Get current user", async () => {
    const response = await request(app)
      .get("/user")
      .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(user.name);
    expect(response.body.email).toBe(user.email);
  });
  

  test("Test Post user", async () => {
    const response = await request(app)
      .post("/user")
      .set("Authorization", "JWT " + accessToken)
      .send(user);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(user.name);
    expect(response.body.email).toBe(user.email);
    expect(response.body._id).toBe(user._id);
  });
 
  // test("Test Get All users with one user in DB", async () => {
  //   const response = await request(app).get("/user").set("Authorization", "JWT " + accessToken);
  //   expect(response.statusCode).toBe(200);
  //   expect(response.body.length).toBe(1);
  //   const st = response.body[0];
  //   //console.log(response.body);
  //   expect(st.name).toBe(user.name);
  //   expect(st.email).toBe(user.email);
  //   //expect(st._id).toBe(user._id);
  //   expect(st.password).not.toBe(user.password); // Assuming st.password contains the hashed password

  // });

  // test("Test Post duplicate user", async () => {
  //   const response = await request(app).post("/user").set("Authorization", "JWT " + accessToken).send(user);
  //   expect(response.statusCode).toBe(406);
  // });
  test("Test Post duplicate user", async () => {
    const response = await request(app)
      .post("/user")
      .set("Authorization", "JWT " + accessToken)
      .send(user);
    expect(response.statusCode).toBe(406);
  });
  test("Test Update current user", async () => {
    const updatedUserData: IUser = {
      name: "Updated Name",
      email: "updated@test.com",
      password: "A00000000",
    };
  
    const response = await request(app)
      .put("/user") // Assuming the endpoint is correct
      .set("Authorization", "JWT " + accessToken)
      .send(updatedUserData);
  
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(updatedUserData.name);
    expect(response.body.email).toBe(updatedUserData.email);
  
    // Verify that the user data is updated in the database
    const updatedUser = await User.findOne({ email: updatedUserData.email });
    expect(updatedUser).not.toBeNull();
    expect(updatedUser!.name).toBe(updatedUserData.name);
  });
  
  test("Test DELETE /user/:id", async () => {
    // Add the user to the database
    const response = await request(app)
      .post("/user")
      .send(user);
      //UnAothorized - no token
    expect(response.statusCode).toBe(401);
  });
  

  
});
