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
const user_model_2 = __importDefault(require("../models/user_model"));
let app;
let accessToken;
/*const user = {
  email: "testuser@test.com",
  password: "1234567890",
}*/
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("beforeAll");
    yield user_model_1.default.deleteMany();
    user_model_2.default.deleteMany({ 'email': user.email });
    yield (0, supertest_1.default)(app).post("/auth/register").send(user);
    const response = yield (0, supertest_1.default)(app).post("/auth/login").send(user);
    accessToken = response.body.accessToken;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    user_model_2.default.deleteMany({ 'email': user.email });
    yield mongoose_1.default.connection.close();
}));
const user = {
    name: "Joe 123",
    _id: "33",
    email: "abc@test.com",
    password: "A00000000"
};
describe("Users tests", () => {
    // const adduser = async (user: IUser) => {
    //   const response = await request(app)
    //   .post("/user")
    //   .set("Authorization", "JWT " + accessToken)
    //   .send(user);
    //   expect(response.statusCode).toBe(201);
    //   expect(response.text).toBe("OK");
    // };
    // test("Test Get All users - empty response", async () => {
    //   const response = await request(app).get("/user").set("Authorization", "JWT " + accessToken);
    //   expect(response.statusCode).toBe(200);
    //   expect(response.body).toStrictEqual([]);
    // });
    test("Test Get current user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/user")
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(user.name);
        expect(response.body.email).toBe(user.email);
    }));
    // test("Test Post user", async () => {
    //   adduser(user);
    // });
    test("Test Post user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/user")
            .set("Authorization", "JWT " + accessToken)
            .send(user);
        expect(response.statusCode).toBe(201);
    }));
    test("Test Get All users with one user in DB", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/user").set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        const st = response.body[0];
        //console.log(response.body);
        expect(st.name).toBe(user.name);
        expect(st.email).toBe(user.email);
        //expect(st._id).toBe(user._id);
        expect(st.password).not.toBe(user.password); // Assuming st.password contains the hashed password
    }));
    // test("Test Post duplicate user", async () => {
    //   const response = await request(app).post("/user").set("Authorization", "JWT " + accessToken).send(user);
    //   expect(response.statusCode).toBe(406);
    // });
    test("Test Post duplicate user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/user")
            .set("Authorization", "JWT " + accessToken)
            .send(user);
        expect(response.statusCode).toBe(406);
    }));
    test("Test Update current user", () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedUserData = {
            name: "Updated Name",
            email: "updated@test.com",
            password: "A00000000",
        };
        const response = yield (0, supertest_1.default)(app)
            .put("/user") // Assuming the endpoint is correct
            .set("Authorization", "JWT " + accessToken)
            .send(updatedUserData);
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(updatedUserData.name);
        expect(response.body.email).toBe(updatedUserData.email);
        // Verify that the user data is updated in the database
        const updatedUser = yield user_model_2.default.findOne({ email: updatedUserData.email });
        expect(updatedUser).not.toBeNull();
        expect(updatedUser.name).toBe(updatedUserData.name);
    }));
    test("Test DELETE /user/:id", () => __awaiter(void 0, void 0, void 0, function* () {
        // Add the user to the database
        const response = yield (0, supertest_1.default)(app)
            .post("/user")
            .set("Authorization", "JWT " + accessToken)
            .send(user);
        expect(response.statusCode).toBe(201);
        // Get the user ID of the added user
        const addedUser = yield user_model_2.default.findOne({ email: user.email });
        const userId = addedUser._id;
        // Send the delete request with the appropriate authorization token
        const deleteResponse = yield (0, supertest_1.default)(app)
            .delete(`/user/${userId}`)
            .set("Authorization", "JWT " + accessToken);
        expect(deleteResponse.statusCode).toBe(200);
    }));
});
//# sourceMappingURL=user.test.js.map