"use strict";
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
const user = {
    name: "John Doe",
    email: "john@student.com",
    password: "1234567890",
    imgUrl: "https://www.google.com",
};
const review = {
    title: "Test Movie",
    message: "Test Description",
    postImg: "https://www.google.com",
    comments: [],
    owner: user._id,
};
const comment = {
    content: "test description",
    owner: user._id,
    postId: review._id,
    createdAt: new Date(),
};
beforeAll(async () => {
    app = await (0, app_1.default)();
    console.log("beforeAll");
    await user_model_1.default.deleteMany({ email: user.email });
    const response = await (0, supertest_1.default)(app).post("/auth/register").send(user);
    user._id = response.body._id;
    accessToken = response.body.accessToken;
    const postedUser = await user_model_1.default.findOne({ email: user.email });
    user._id = postedUser.id;
    review.owner = postedUser.id;
    comment.owner = postedUser.id;
    const postedReview = await post_model_1.default.create(review);
    review._id = postedReview._id;
    comment.postId = postedReview._id;
});
afterAll(async () => {
    await mongoose_1.default.connection.close();
});
describe("Post comment test", () => {
    const addComment = async (comment) => {
        const response = await (0, supertest_1.default)(app)
            .post("/comments")
            .set("Authorization", "JWT " + accessToken)
            .send(comment);
        expect(response.statusCode).toBe(201);
        expect(response.body.owner).toBe(user._id);
        expect(response.body.content).toBe(comment.content);
        expect(response.body.postId).toBe(review._id.toString());
    };
    test("Test post", async () => {
        await addComment(comment);
    });
    test("Test posting a comment to a non-existent post", async () => {
        // Create a comment object with a postId that does not exist
        const invalidComment = {
            content: "test description",
            owner: user._id,
            postId: user._id, // not post id so should fail
            createdAt: new Date(),
        };
        const response = await (0, supertest_1.default)(app)
            .post("/comments")
            .set("Authorization", "JWT " + accessToken)
            .send(invalidComment);
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("post not found");
    });
    test("Test posting a comment with internal server error", async () => {
        const invalidComment = Object.assign(Object.assign({}, comment), { postId: "invalid_post_id" });
        const response = await (0, supertest_1.default)(app)
            .post("/comments")
            .set("Authorization", "JWT " + accessToken)
            .send(invalidComment);
        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe("Internal Server Error");
    });
});
//# sourceMappingURL=comment.test.js.map