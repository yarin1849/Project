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
const post = {
    title: "Test Post",
    message: "Test Description",
    postImg: "https://www.google.com",
    comments: [],
    owner: user._id,
};
const comment = {
    content: "test description",
    owner: user._id,
    postId: post._id,
    createdAt: new Date(),
};
beforeAll(async () => {
    app = await (0, app_1.default)();
    console.log("beforeAll");
    await user_model_1.default.deleteMany({ email: user.email });
    const response = await (0, supertest_1.default)(app).post("/auth/register").send(user);
    user._id = response.body._id;
    accessToken = response.body.accessToken;
    //wait for user to be created
    await user_model_1.default.findOne({ email: user.email });
    const postedUser = await user_model_1.default.findOne({ email: user.email });
    user._id = postedUser.id;
    post.owner = postedUser.id;
    comment.owner = postedUser.id;
    // Create the post
    const postedReview = await post_model_1.default.create(post);
    post._id = postedReview._id;
    comment.postId = postedReview._id;
    // Add a comment to the post
    const commentResponse = await (0, supertest_1.default)(app)
        .post("/comments")
        .set("Authorization", "JWT " + accessToken)
        .send(comment);
    const commentId = commentResponse.body._id;
    console.log("commentId", commentId);
    post.comments.push(commentId);
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
        expect(response.body.postId).toBe(post._id.toString());
    };
    test("Test post", async () => {
        await addComment(comment);
        console.log("comment", comment);
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
    test("Test getCommentCount", async () => {
        const response = await (0, supertest_1.default)(app).get(`/comments/count/${post._id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.count).toBeGreaterThanOrEqual(1);
    });
    test("Test invalid CommentCount", async () => {
        const response = await (0, supertest_1.default)(app).get(`/comments/count/"invalid"`);
        expect(response.statusCode).toBe(500);
    });
    test("Test getCommentById with valid ID", async () => {
        await addComment(comment);
        console.log("comment", comment);
        console.log("post._id", post._id);
        const response = await (0, supertest_1.default)(app)
            .get(`/comments/${post._id}`)
            .set("Authorization", "JWT " + accessToken);
        console.log("response", response.body);
        expect(response.statusCode).toBe(200);
    });
    //   test("Test format of returned comments", async () => {
    //         await addComment(comment);
    //     const response = await request(app)
    //       .get(`/comments/${post._id}`)
    //       .set("Authorization", "JWT " + accessToken)
    //       .expect(200)
    // //      .expect("Content-Type", /json/);
    //     console.log("Response body:", response.body);
    //     // Ensure that the comments field is populated
    //     expect(response.body.comments.length).toBeGreaterThan(0);
    //     response.body.comments.forEach((comment) => {
    //       expect(comment).toHaveProperty("content");
    //       expect(comment).toHaveProperty("owner");
    //       expect(comment).toHaveProperty("createdAt");
    //       expect(comment).toHaveProperty("postId");
    //     });
    //   });
});
//# sourceMappingURL=comment.test.js.map