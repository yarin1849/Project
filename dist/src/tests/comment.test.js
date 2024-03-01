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
const comment_model_1 = __importDefault(require("../models/comment_model"));
let app;
let accessToken;
let user;
let post1;
let comment1;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("beforeAll");
    yield post_model_1.default.deleteMany();
    yield user_model_1.default.deleteMany({ 'email': 'test@.post.test' });
    yield comment_model_1.default.deleteMany({});
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
        postImg: "postImg1",
    };
    // Create a comment
    comment1 = {
        content: "comment1",
        owner: "1234567890",
        createdAt: new Date(),
    };
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe("Comment controller tests", () => {
    test("Test Get All comments - empty response", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comment");
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
    }));
    test("Test Post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/comment")
            .set("Authorization", "JWT " + accessToken)
            .send(comment1);
        expect(response.statusCode).toBe(201);
    }));
    test("Test Get All comments - response with one comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comment");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
    }));
    test("Test Get comment by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comment");
        const comment = response.body[0];
        const response2 = yield (0, supertest_1.default)(app).get("/comment/" + comment._id);
        expect(response2.statusCode).toBe(200);
        expect(response2.body.message).toBe(comment1.content);
    }));
    test("Test Put comment by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comment");
        const comment = response.body[0];
        const response2 = yield (0, supertest_1.default)(app)
            .put("/comment/" + comment._id)
            .set("Authorization", "JWT " + accessToken)
            .send({ message: "new comment" });
        expect(response2.statusCode).toBe(200);
        expect(response2.body.message).toBe("new comment");
    }));
    test("Test Delete comment by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comment");
        const comment = response.body[0];
        const response2 = yield (0, supertest_1.default)(app)
            .delete("/comment/" + comment._id)
            .set("Authorization", "JWT " + accessToken);
        expect(response2.statusCode).toBe(200);
        expect(response2.body.message).toBe(comment1.content);
    }));
});
//# sourceMappingURL=comment.test.js.map