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
const post_model_1 = __importDefault(require("../models/post_model"));
let app;
let accessToken = "";
let user;
let post1;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("beforeAll");
    yield post_model_1.default.deleteMany();
    yield user_model_1.default.deleteMany({ 'email': 'test@.post.test' });
    // Register a user
    const registerResponse = yield (0, supertest_1.default)(app).post("/auth/register").send({
        name: "bla",
        email: "test@.post.test",
        password: "1234567890",
    });
    user = registerResponse.body;
    // Login to get the access token
    const loginResponse = yield (0, supertest_1.default)(app).post("/auth/login").send({
        email: user.email,
        password: "1234567890",
    });
    accessToken = loginResponse.body.accessToken;
    // Create a post
    post1 = {
        comments: [],
        title: "title1",
        message: "message1",
        owner: user._id,
    };
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe("Post controller tests", () => {
    test("Test Get All  posts - empty response", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/userpost");
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
    }));
    test("Test Post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/userpost")
            .set("Authorization", "JWT " + accessToken)
            .send(post1);
        expect(response.statusCode).toBe(201);
        expect(response.body.owner).toBe(user._id);
        expect(response.body.title).toBe(post1.title);
        expect(response.body.message).toBe(post1.message);
    }));
    test("Test Get All user posts with one post in DB", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/userpost");
        expect(response.statusCode).toBe(200);
        const rc = response.body[0];
        expect(rc.title).toBe(post1.title);
        expect(rc.message).toBe(post1.message);
        expect(rc.owner).toBe(user._id);
    }));
    test("Test PUT /userpost/:id", () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedPost = {
            comments: [],
            title: "updatedTitle",
            message: "updatedMessage",
            owner: user._id,
        };
        const response = yield (0, supertest_1.default)(app)
            .put(`/userpost/${post1._id}`)
            .set("Authorization", "JWT " + accessToken)
            .send(updatedPost);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(updatedPost.title);
        expect(response.body.message).toBe(updatedPost.message);
        expect(response.body.owner).toBe(user._id);
    }));
    test("Test DELETE /userpost/:id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete(`/userpost/${post1._id}`)
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
    }));
    test("Test Get All  posts - existing posts", () => __awaiter(void 0, void 0, void 0, function* () {
        // Create some posts
        const post2 = {
            title: "title2",
            message: "message2",
            owner: user._id,
        };
        const post3 = {
            title: "title3",
            message: "message3",
            owner: user._id,
        };
        yield (0, supertest_1.default)(app)
            .post("/userpost")
            .set("Authorization", "JWT " + accessToken)
            .send(post2);
        yield (0, supertest_1.default)(app)
            .post("/userpost")
            .set("Authorization", "JWT " + accessToken)
            .send(post3);
        const response = yield (0, supertest_1.default)(app).get("/userpost");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(3); // Expecting 3 posts including the previously created post1
    }));
    test("Test Get User post by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        // First, create a post
        const response = yield (0, supertest_1.default)(app)
            .post("/userpost")
            .set("Authorization", "JWT " + accessToken)
            .send(post1);
        expect(response.statusCode).toBe(201);
        // Then, retrieve the created post by ID
        const createdPostId = response.body._id;
        const getByIdResponse = yield (0, supertest_1.default)(app).get(`/userpost/${createdPostId}`);
        expect(getByIdResponse.statusCode).toBe(200);
        expect(getByIdResponse.body.title).toBe(post1.title);
        expect(getByIdResponse.body.message).toBe(post1.message);
        expect(getByIdResponse.body.owner).toBe(user._id);
    }));
});
//# sourceMappingURL=post.test.js.map