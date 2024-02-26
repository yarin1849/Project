"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user_model"));
// import jwt from 'jsonwebtoken'; // Import jsonwebtoken library
// // Add the generateValidRefreshToken function here
// const generateValidRefreshToken = async () => {
//   // Assuming you have access to the user's ID or any unique identifier
//   const userId = user._id; // Replace with the actual user ID
//   // Sign a refresh token with the user's ID as the payload
//   const refreshToken = jwt.sign({ _id: userId }, process.env.JWT_REFRESH_SECRET);
//   return refreshToken;
// };
let app;
const user = {
    _id: "1234",
    name: "user1",
    email: "testUser@test.com",
    password: "1234567890",
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("beforeAll");
    yield user_model_1.default.deleteMany({ 'email': user.email });
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
let accessToken;
let refreshToken;
let newRefreshToken;
describe("Auth tests", () => {
    test("Test Register", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/register")
            .send(user);
        expect(response.statusCode).toBe(201);
    }));
    test("Test Register exist email", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/register")
            .send(user);
        expect(response.statusCode).toBe(406);
    }));
    test("Test Register missing password", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/register").send({
            email: "test@test.com",
        });
        expect(response.statusCode).toBe(400);
    }));
    test("Test Login", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/login").send(user);
        expect(response.statusCode).toBe(200);
        accessToken = response.body.accessToken;
        refreshToken = response.body.refreshToken;
        expect(accessToken).toBeDefined();
    }));
    test("Test forbidden access without token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/user");
        expect(response.statusCode).toBe(401);
    }));
    test("Test access with valid token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/user")
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
    }));
    test("Test access with invalid token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/user")
            .set("Authorization", "JWT 1" + accessToken);
        expect(response.statusCode).toBe(401);
    }));
    jest.setTimeout(10000);
    test("Test access after timeout of token", () => __awaiter(void 0, void 0, void 0, function* () {
        yield new Promise(resolve => setTimeout(() => resolve("done"), 5000));
        const response = yield (0, supertest_1.default)(app)
            .get("/user")
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).not.toBe(200);
    }));
    test("Test refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/auth/refresh")
            .set("Authorization", "JWT " + refreshToken)
            .send();
        expect(response.statusCode).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
        const newAccessToken = response.body.accessToken;
        newRefreshToken = response.body.refreshToken;
        const response2 = yield (0, supertest_1.default)(app)
            .get("/user")
            .set("Authorization", "JWT " + newAccessToken);
        expect(response2.statusCode).toBe(200);
    }));
    test("Test double use of refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/auth/refresh")
            .set("Authorization", "JWT " + refreshToken)
            .send();
        expect(response.statusCode).not.toBe(200);
        //verify that the new token is not valid as well
        const response1 = yield (0, supertest_1.default)(app)
            .get("/auth/refresh")
            .set("Authorization", "JWT " + newRefreshToken)
            .send();
        expect(response1.statusCode).not.toBe(200);
    }));
    test("Test invalid email format", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/register")
            .send({
            email: "", // Invalid email format (missing @)
            password: "1234567890",
        });
        expect(response.statusCode).toBe(400);
    }));
    test("Test invalid password length (empty password)", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/register")
            .send({
            email: "test@test.com",
            password: "", // Invalid password length (empty password)
        });
        expect(response.statusCode).toBe(400);
    }));
    test("Test missing email in login", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/login")
            .send({
            password: "1234567890",
        });
        expect(response.statusCode).toBe(400);
    }));
    test("Test missing password in login", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/login")
            .send({
            email: "test@test.com",
        });
        expect(response.statusCode).toBe(400);
    }));
    // New tests
    test("Test missing email in registration", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/register")
            .send({
            password: "1234567890",
        });
        expect(response.statusCode).toBe(400);
    }));
    test("Test missing password in registration", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/register")
            .send({
            email: "test@test.com",
        });
        expect(response.statusCode).toBe(400);
    }));
    test("Test missing name in registration", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/register")
            .send({
            email: "test@test.com",
            password: "1234567890",
        });
        expect(response.statusCode).toBe(400);
    }));
    test("Test missing name in registration", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/register")
            .send({
            email: "test@test.com",
            password: "1234567890",
        });
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe("missing email or password");
    }));
    test("Test Login with incorrect email", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/login")
            .send({
            email: "incorrectemail@test.com", // Incorrect email
            password: "1234567890", // Correct password
        });
        expect(response.statusCode).toBe(401);
        expect(response.text).toBe("email or password incorrect");
    }));
    test("Test Login with incorrect password", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/login")
            .send({
            email: "test@test.com", // Correct email
            password: "incorrectpassword", // Incorrect password
        });
        expect(response.statusCode).toBe(401);
        expect(response.text).toBe("email or password incorrect");
    }));
    test("Test Logout with missing refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/auth/logout");
        expect(response.statusCode).toBe(401);
    }));
    test("Test Logout with invalid refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidRefreshToken = "invalid_refresh_token";
        const response = yield (0, supertest_1.default)(app)
            .get("/auth/logout")
            .set("Authorization", "JWT " + invalidRefreshToken);
        expect(response.statusCode).toBe(401);
    }));
    // Remove the commented out test cases if they are not needed anymore
    test("Test Logout with missing refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/auth/logout");
        expect(response.statusCode).toBe(401);
    }));
    test("Test Logout with invalid refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidRefreshToken = "invalid_refresh_token";
        const response = yield (0, supertest_1.default)(app)
            .get("/auth/logout")
            .set("Authorization", "JWT " + invalidRefreshToken);
        expect(response.statusCode).toBe(401);
    }));
});
//# sourceMappingURL=auth.test.js.map