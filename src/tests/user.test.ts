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
  const adduser = async (user: IUser) => {
    const response = await request(app)
    .post("/user")
    .set("Authorization", "JWT " + accessToken)
    .send(user);
    expect(response.statusCode).toBe(201);
    expect(response.text).toBe("OK");
  };
  // test("Test Get All users - empty response", async () => {
  //   const response = await request(app).get("/user").set("Authorization", "JWT " + accessToken);
  //   expect(response.statusCode).toBe(200);
  //   expect(response.body).toStrictEqual([]);
  // });
  

  test("Test Post user", async () => {
    adduser(user);
  });

  test("Test Get All users with one user in DB", async () => {
    const response = await request(app).get("/user").set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    const st = response.body[0];
    //console.log(response.body);
    expect(st.name).toBe(user.name);
    expect(st.email).toBe(user.email);
    //expect(st._id).toBe(user._id);
    expect(st.password).not.toBe(user.password); // Assuming st.password contains the hashed password

  });

  test("Test Post duplicate user", async () => {
    const response = await request(app).post("/user").set("Authorization", "JWT " + accessToken).send(user);
    expect(response.statusCode).toBe(406);
  });

  // test("Test PUT /user/:id", async () => {
  //   const updateduser = { ...user, name: "Jane Doe 33" };
  //   const response = await request(app)
  //     .put("/user/" + user._id)
  //     .set("Authorization", "JWT " + accessToken)
  //     .send(updateduser);
  //   expect(response.statusCode).toBe(200);
  //   expect(response.body.name).toBe(updateduser.name);
  // });

  // test("Test DELETE /user/:id", async () => {
  //   const response = await request(app).delete(`/user/${user._id}`);
  //   expect(response.statusCode).toBe(200);
  // });
  test("Test DELETE /user/:id", async () => {
    // Add the user to the database
    await adduser(user);
  
    // Get the user ID of the added user
    const addeduser = await User.findOne({ email: user.email });
    const userId = addeduser._id;
  
    // Send the delete request with the appropriate authorization token
    const response = await request(app)
      .delete(`/user/${userId}`) // Assuming the endpoint is /user/:id
      .set("Authorization", "JWT " + accessToken);
  
    // Check the response status code
    expect(response.statusCode).toBe(200);
  });
  
  
});
