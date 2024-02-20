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
const post_model_1 = __importDefault(require("../models/post_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
const user = {
    name: "bla",
    email: "testStudent@test.com",
    password: "1234567890",
};
let accessToken;
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("beforeAll");
    yield post_model_1.default.deleteMany();
    yield user_model_1.default.deleteMany({ 'email': user.email });
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
const post1 = {
    _id: 1,
    title: "title1",
    message: "message1",
};
describe("Student post tests", () => {
    const addStudentPost = (post) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/studentpost")
            .set("Authorization", "JWT " + accessToken)
            .send(post);
        expect(response.statusCode).toBe(201);
        expect(response.text).toBe("OK");
    });
    test("Get token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/register")
            .send(user);
        user._id = response.body._id;
        const response2 = yield (0, supertest_1.default)(app)
            .post("/auth/login")
            .send(user);
        accessToken = response2.body.accessToken;
        expect(accessToken).toBeDefined();
    }));
    test("Test Get All Student posts - empty response", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/studentpost")
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
    }));
    test("Test Post Student post", () => __awaiter(void 0, void 0, void 0, function* () {
        addStudentPost(post1);
    }));
    test("Test Get All Students posts with one post in DB", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/studentpost")
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        const rc = response.body[0];
        expect(rc.title).toBe(post1.title);
        expect(rc.message).toBe(post1.message);
        expect(rc.owner).toBe(user._id);
    }));
    test("Test PUT /studentpost/:id", () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedPost = {
            _id: 1,
            title: "updatedTitle",
            message: "updatedMessage",
        };
        const response = yield (0, supertest_1.default)(app)
            .put(`/studentpost/${post1._id}`)
            .set("Authorization", "JWT " + accessToken)
            .send(updatedPost);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(updatedPost.title);
        expect(response.body.message).toBe(updatedPost.message);
        expect(response.body.owner).toBe(user._id);
    }));
    test("Test DELETE /studentpost/:id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete(`/studentpost/${post1._id}`)
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
    }));
});
test("Test Post duplicate Student post", () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, supertest_1.default)(app).post("/studentpost")
        .set("Authorization", "JWT " + accessToken)
        .send(post1);
    expect(response.statusCode).toBe(406);
}));
test("Test forbidden access without token", () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, supertest_1.default)(app).get("/studentpost");
    expect(response.statusCode).toBe(200);
}));
test("Test access with invalid token", () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, supertest_1.default)(app)
        .get("/studentpost")
        .set("Authorization", "JWT 1" + accessToken);
    expect(response.statusCode).toBe(200);
}));
//# sourceMappingURL=post.test.js.map