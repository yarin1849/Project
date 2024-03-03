import request from "supertest";
import { Express } from "express";
import initApp from "../app";
import mongoose from "mongoose";
import User, { IUser } from "../models/user_model";
import Post, { IPost } from "../models/post_model";
import Review, { IReview } from "../models/review_model";

let app: Express;
let user: IUser;
let post: IPost;
let review: IReview;
let token: string;

beforeAll(async () => {
    app = await initApp();
    console.log("beforeAll");
}
);


afterAll(async () => {
    await mongoose.connection.close();
    console.log("afterAll");
}
);


describe("Review controller tests", () => {
    test("Test Get All reviews - empty response", async () => {
        const response = await request(app).get("/review");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    }
    );

    test("Test Get review by ID - not found", async () => {
        const response = await request(app).get("/review/1234567890");
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Review not found" });
    }
    );

    test("Test Create review - bad request", async () => {
        const response = await request(app).post("/review").send({
            trailId: "1234567890",
            userId: user._id,
            rating: 6,
            comment: "comment1",
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Bad request" });
    }
    );

    test("Test Update review - bad request", async () => {
        const response = await request(app).put(`/review/${review._id}`).send({
            rating: 6,
            comment: "comment1",
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Bad request" });
    }
    );

    test("Test Update review - not found", async () => {
        const response = await request(app).put("/review/1234567890").send({
            rating: 5,
            comment: "comment1",
        });
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Review not found" });
    }
    );

    test("Test Get All reviews - response with one review", async () => {
        const response = await request(app).get("/review");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
    }
    );

    test("Test Create review", async () => {
        const response = await request(app).post("/review").send({
            trailId: "1234567890",
            userId: user._id,
            rating: 5,
            comment: "comment1",
        });
        expect(response.status).toBe(201);
    }
    );
}
);

