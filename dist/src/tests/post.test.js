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
let user;
let post1;
beforeAll(async () => {
    app = await (0, app_1.default)();
    console.log("beforeAll");
    await post_model_1.default.deleteMany();
    await user_model_1.default.deleteMany({ 'email': 'test@.post.test' });
    // Register a user
    const registerResponse = await (0, supertest_1.default)(app).post("/auth/register").send({
        name: "bla",
        email: "test@.post.test",
        password: "1234567890",
    });
    user = registerResponse.body;
    // Login to get the access token
    const loginResponse = await (0, supertest_1.default)(app).post("/auth/login").send({
        email: user.email,
        password: "1234567890",
    });
    accessToken = loginResponse.body.accessToken;
    // Create a post
    post1 = {
        comments: [],
        title: "title1",
        message: "this is my first message",
        owner: user._id,
        postImg: "postImg1",
    };
});
afterAll(async () => {
    await mongoose_1.default.connection.close();
});
describe("Post controller tests", () => {
    test("Test Get All  posts - empty response", async () => {
        const response = await (0, supertest_1.default)(app).get("/userpost");
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
    });
    // test("Test Post", async () => {
    //   const response = await request(app)
    //     .post("/userpost")
    //     .set("Authorization", "JWT " + accessToken)
    //     .send(post1);
    //   expect(response.statusCode).toBe(201);
    //   expect(response.body.owner).toBe(user._id);
    //   expect(response.body.title).toBe(post1.title);
    //   expect(response.body.message).toBe(post1.message);
    // });
    test("Test Post", async () => {
        const newPost1 = {
            comments: [],
            title: "title3",
            message: "this is my 3rd message",
            owner: user._id,
            postImg: "postImg3",
        };
        const response = await (0, supertest_1.default)(app)
            .post("/userpost")
            .set("Authorization", "JWT " + accessToken)
            .send(newPost1);
        expect(response.statusCode).toBe(201);
        expect(response.body.owner).toBe(user._id);
        expect(response.body.title).toBe(newPost1.title);
        expect(response.body.message).toBe(newPost1.message);
    });
    test("Test Get All user posts with one post in DB", async () => {
        const response = await (0, supertest_1.default)(app).get("/userpost");
        expect(response.statusCode).toBe(200);
        const rc = response.body[0];
        expect(rc.title).toBe(post1.title);
        expect(rc.message).toBe(post1.message);
        expect(rc.owner).toBe(user._id);
    });
    test("Test PUT /userpost/:id", async () => {
        const updatedPost = {
            comments: [],
            title: "updatedTitle",
            message: "updatedMessage",
            owner: user._id,
            postImg: "postImg1",
        };
        const response = await (0, supertest_1.default)(app)
            .put(`/userpost/${post1._id}`)
            .set("Authorization", "JWT " + accessToken)
            .send(updatedPost);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(updatedPost.title);
        expect(response.body.message).toBe(updatedPost.message);
        expect(response.body.owner).toBe(user._id);
    });
    // test("Test DELETE /userpost/:id", async () => {
    //   const response = await request(app).delete(`/userpost/${post1._id}`)
    //     .set("Authorization", "JWT " + accessToken);
    //   expect(response.statusCode).toBe(200);
    // });
    test("Test Get All  posts - existing posts", async () => {
        // Create some posts
        const post2 = {
            title: "title22",
            message: "message22",
            owner: user._id,
            comments: [],
            postImg: "postImg222",
        };
        const post3 = {
            title: "title33",
            message: "message33",
            owner: user._id,
            comments: [],
            postImg: "postImg33",
        };
        await (0, supertest_1.default)(app)
            .post("/userpost")
            .set("Authorization", "JWT " + accessToken)
            .send(post2);
        await (0, supertest_1.default)(app)
            .post("/userpost")
            .set("Authorization", "JWT " + accessToken)
            .send(post3);
        const response = await (0, supertest_1.default)(app).get("/userpost");
        expect(response.statusCode).toBe(200);
        //expect(response.body.length).toBe(3); // Expecting 3 posts including the previously created post1
        const createdPosts = response.body;
        expect(createdPosts.length).toBeGreaterThan(0);
    });
    test("Test Post 2 new Posts ", async () => {
        // Create some posts
        const post2 = {
            title: "title2",
            message: "message2",
            owner: '1234',
        };
        const post3 = {
            title: "title3",
            message: "message3",
            owner: '123456',
        };
        await (0, supertest_1.default)(app)
            .post("/userpost")
            .set("Authorization", "JWT " + accessToken)
            .send(post2);
        await (0, supertest_1.default)(app)
            .post("/userpost")
            .set("Authorization", "JWT " + accessToken)
            .send(post3);
        const response = await (0, supertest_1.default)(app).post("/userpost");
        //expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(2); // Expecting 3 posts including the previously created post1
        const createdPosts = response.body;
        expect(createdPosts.length).toBeGreaterThan(0);
    });
    test("Test Get User post by ID", async () => {
        // First, create a post
        const response = await (0, supertest_1.default)(app)
            .post("/userpost")
            .set("Authorization", "JWT " + accessToken)
            .send(post1);
        expect(response.statusCode).toBe(201);
        // Then, retrieve the created post by ID
        const createdPostId = response.body._id;
        const getByIdResponse = await (0, supertest_1.default)(app).get(`/userpost/${createdPostId}`);
        expect(getByIdResponse.statusCode).toBe(200);
        expect(getByIdResponse.body.title).toBe(post1.title);
        expect(getByIdResponse.body.message).toBe(post1.message);
        expect(getByIdResponse.body.owner).toBe(user._id);
    });
    // test("Test Post", async () => {
    //   const response = await request(app)
    //     .post("/userpost")
    //     .set("Authorization", "JWT " + accessToken)
    //     .send(post1);
    //   expect(response.statusCode).toBe(201);
    //   expect(response.body.owner).toBe(user._id);
    //   expect(response.body.title).toBe(post1.title);
    //   expect(response.body.message).toBe(post1.message);
    // });
    test("Test Get Post by ID - Post Found", async () => {
        // Make a request to create a post
        const postResponse = await (0, supertest_1.default)(app)
            .post("/userpost")
            .set("Authorization", "JWT " + accessToken)
            .send(post1);
        expect(postResponse.statusCode).toBe(201);
        // Extract the created post ID
        const postId = postResponse.body._id;
        // Make a request to retrieve the created post by ID using getById2
        const getByIdResponse = await (0, supertest_1.default)(app).get(`/userpost/${postId}`);
        // Assert the status code and the properties of the returned post
        expect(getByIdResponse.statusCode).toBe(200);
        expect(getByIdResponse.body.title).toBe(post1.title);
        expect(getByIdResponse.body.message).toBe(post1.message);
        expect(getByIdResponse.body.owner).toBe(user._id);
    });
    test("Test Delete Post by ID - Post Found", async () => {
        // Make a request to create a post
        const postResponse = await (0, supertest_1.default)(app)
            .post("/userpost")
            .set("Authorization", "JWT " + accessToken)
            .send(post1);
        expect(postResponse.statusCode).toBe(201);
        // Extract the created post ID
        const postId = postResponse.body._id;
        // Make a request to delete the created post by ID
        const deleteResponse = await (0, supertest_1.default)(app).delete(`/userpost/${postId}`)
            .set("Authorization", "JWT " + accessToken);
        // Assert the status code and the response body
        expect(deleteResponse.statusCode).toBe(200);
        expect(deleteResponse.body._id).toBe(postId);
    });
});
//# sourceMappingURL=post.test.js.map