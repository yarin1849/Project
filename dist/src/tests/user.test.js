"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user_model"));
let app;
let accessToken;
let user;
beforeAll(async () => {
    app = await (0, app_1.default)();
    console.log("beforeAll");
    await user_model_1.default.deleteMany();
    // Register a user and obtain the access token
    user = {
        name: "Joe 123",
        email: "abc@test.com",
        password: "A00000000"
    };
    await (0, supertest_1.default)(app).post("/auth/register").send(user);
    const response = await (0, supertest_1.default)(app).post("/auth/login").send(user);
    accessToken = response.body.accessToken;
});
afterAll(async () => {
    await user_model_1.default.deleteMany();
    await mongoose_1.default.connection.close();
});
describe("Users tests", () => {
    test("Test Get current user", async () => {
        const response = await (0, supertest_1.default)(app)
            .get("/user")
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(user.name);
        expect(response.body.email).toBe(user.email);
    });
    test("Test POST /user", async () => {
        const newUser = {
            name: "Alice",
            email: "alice@test.com",
            password: "password123"
        };
        const response = await (0, supertest_1.default)(app)
            .post("/user")
            .set("Authorization", "JWT " + accessToken)
            .send(newUser);
        expect(response.statusCode).toBe(201);
        expect(response.body.name).toBe(newUser.name);
        expect(response.body.email).toBe(newUser.email);
    });
    test("Test POST /user with invalid data", async () => {
        const invalidUser = {
            name: "Bob", // Missing email and password
            email: '',
            password: ''
        };
        const response = await (0, supertest_1.default)(app)
            .post("/user")
            .set("Authorization", "JWT " + accessToken)
            .send(invalidUser);
        expect(response.statusCode).toBe(406);
        expect(response.text).toContain("fail");
    });
    test("Test DELETE /user/:id", async () => {
        // Add the user to the database
        const response = await (0, supertest_1.default)(app)
            .post("/user")
            .send(user);
        //UnAothorized - no token
        expect(response.statusCode).toBe(401);
    });
    test("Test Non-existent User Delete", async () => {
        // Delete a non-existent user with an invalid ID
        const response = await (0, supertest_1.default)(app)
            .delete("/user/invalid_id")
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(500);
    });
    test("Test Non-existent User PUT", async () => {
        // Delete a non-existent user with an invalid ID
        const response = await (0, supertest_1.default)(app)
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
//# sourceMappingURL=user.test.js.map