"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
let app;
let user;
//let post: IPost;
let review;
//let token: string;
beforeAll(async () => {
    app = await (0, app_1.default)();
    console.log("beforeAll");
});
afterAll(async () => {
    await mongoose_1.default.connection.close();
    console.log("afterAll");
});
describe("Review controller tests", () => {
    test("Test Get All reviews - empty response", async () => {
        const response = await (0, supertest_1.default)(app).get("/review");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });
    test("Test Get review by ID - not found", async () => {
        const response = await (0, supertest_1.default)(app).get("/review/1234567890");
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Review not found" });
    });
    test("Test Create review - bad request", async () => {
        const response = await (0, supertest_1.default)(app).post("/review").send({
            trailId: "1234567890",
            userId: user._id,
            rating: 6,
            comment: "comment1",
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Bad request" });
    });
    test("Test Update review - bad request", async () => {
        const response = await (0, supertest_1.default)(app).put(`/review/${review._id}`).send({
            rating: 6,
            comment: "comment1",
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Bad request" });
    });
    test("Test Update review - not found", async () => {
        const response = await (0, supertest_1.default)(app).put("/review/1234567890").send({
            rating: 5,
            comment: "comment1",
        });
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Review not found" });
    });
    test("Test Get All reviews - response with one review", async () => {
        const response = await (0, supertest_1.default)(app).get("/review");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
    });
    test("Test Create review", async () => {
        const response = await (0, supertest_1.default)(app).post("/review").send({
            trailId: "1234567890",
            userId: user._id,
            rating: 5,
            comment: "comment1",
        });
        expect(response.status).toBe(201);
    });
});
//# sourceMappingURL=review.test.js.map