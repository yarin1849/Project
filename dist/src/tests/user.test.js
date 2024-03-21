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
        password: "A00000000",
        _id: Object('123456789')
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
    test("Test Get current user", async () => {
        const response = await (0, supertest_1.default)(app)
            .get("/user")
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(user.name);
        expect(response.body.email).toBe(user.email);
    });
});
//# sourceMappingURL=user.test.js.map