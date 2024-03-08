// import request from "supertest";
// import initApp from "../app";
// import mongoose from "mongoose";
// import Comment from "../models/comment_model";
// import Post from "../models/post_model";
// import { Express } from "express";


// let app: Express;

// beforeAll(async () => {
//   app = await initApp();
// });

// afterAll(async () => {
//   await mongoose.connection.close();
// });

// describe("CommentController tests", () => {
 
//   test("Test creating a comment with valid post ID", async () => {
//     const post = await Post.create({ title: "Test Post", content: "Test post content" });
//     const postId = post._id;
//     const content = "This is a test comment";
    
//     const response = await request(app)
//       .post("/comments")
//       .send({ content, postId });
      
//     expect(response.statusCode).toBe(201);
    
//     const createdComment = await Comment.findById(response.body._id);
//     expect(createdComment).not.toBeNull();
//     expect(createdComment!.content).toBe(content);
//     expect(createdComment!.postId).toBe(postId);
//   });

//   test("Test creating a comment with non-existent post ID", async () => {
//     const postId = "non-existent-post-id";
//     const content = "This is a test comment";

//     const response = await request(app)
//       .post("/comments")
//       .send({ content, postId });
      
//     expect(response.statusCode).toBe(404);
//     expect(response.body.message).toBe("post not found");
//   });

//   test("Test creating a comment with missing content", async () => {
//     const post = await Post.create({ title: "Test Post", content: "Test post content" });
//     const postId = post._id;

//     const response = await request(app)
//       .post("/comments")
//       .send({ postId });

//     expect(response.statusCode).toBe(500);
//     expect(response.body.message).toBe("Internal Server Error");
//   });

//   // Add more tests as needed to cover other scenarios such as error handling for missing fields, etc.
// });



// // import { Express } from "express";
// // import request from "supertest";
// // import initApp from "../app";
// // import mongoose from "mongoose";
// // import { IComment } from "../models/comment_model";
// // import User, { IUser } from "../models/user_model";
// // import Post, { IPost } from "../models/post_model";

// // let app: Express;
// // let accessTokenCookie = "";

// // const user: IUser = {
// //   name: "John Doe",
// //   email: "john@student.com",
// //   password: "1234567890",
// //   imgUrl: "https://www.google.com",
// // };

// // const post: IPost = {
// //   title: "Test Movie",
// //   message: "Test Description",
// //   postImg: "https://www.google.com",
// //   comments: [],
// //   owner: user._id,
// // };

// // const comment: IComment = {
// //   content: "test description",
// //   owner: user._id,
// //   postId: post._id,
// //   createdAt: new Date(),
// // };

// // beforeAll(async () => {
// //   app = await initApp();
  
// //   await User.deleteMany({ email: user.email });
// //   const response = await request(app).post("/auth/register").send(user);
// //   accessTokenCookie = response.headers["set-cookie"] && response.headers["set-cookie"][1]
// //     .split(",")
// //     .map((item) => item.split(";")[0])
// //     .join(";");
  
// //   const postedUser = await User.findOne({ email: user.email });
// //   user._id = postedUser.id;
// //   post.owner = postedUser.id;
// //   comment.owner = postedUser.id;
  
// //   const postedReview = await Post.create(post);
// //   post._id = postedReview._id;
// //   comment.postId = postedReview._id;
// // });

// // afterAll(async () => {
// //   await mongoose.connection.close();
// // });

// // describe("Post comment test", () => {
// //   const addComment = async (comment: IComment) => {
// //     const response = await request(app)
// //       .post("/comments/")
// //       .send(comment);

// //     expect(response.statusCode).toBe(201);
// //     expect(response.body.author).toBe(user._id);
// //     expect(response.body.description).toBe(comment.content);
// //     expect(response.body.reviewId).toBe(post._id.toString());
// //   };

// //   test("Post comment test", async () => {
// //     await addComment(comment);
// //   });

// //   test("Post comment with valid data", async () => {
// //     const validComment = {
// //       content: "This is a valid comment",
// //       postId: post._id.toString(),
// //     };

// //     const response = await request(app)
// //       .post("/comments/")
// //       .send(validComment);

// //     expect(response.statusCode).toBe(201);
// //     expect(response.body.content).toBe(validComment.content);
// //     expect(response.body.author).toBe(user._id.toString());
// //     expect(response.body.postId).toBe(post._id.toString());
// //   });

// //   test("Post comment with non-existing postId", async () => {
// //     const nonExistingPostIdComment = {
// //       content: "This comment has non-existing postId",
// //       postId: "non-existing-post-id",
// //     };

// //     const response = await request(app)
// //       .post("/comments/")
// //       .send(nonExistingPostIdComment);

// //     expect(response.statusCode).toBe(404);
// //     expect(response.body.message).toBe("post not found");
// //   });
// // });

// // describe("Get comments test", () => {
// //   test("Get comments for a post", async () => {
// //     const response = await request(app)
// //       .get(`/comments/${post._id}`);

// //     expect(response.statusCode).toBe(200);
// //     expect(Array.isArray(response.body)).toBe(true);
// //   });
// // });
// // describe("BaseController Methods", () => {
// //   let commentId: string;

// //   test("POST /comments", async () => {
// //     const response = await request(app)
// //       .post("/comments")
// //       .send(comment);

// //     expect(response.statusCode).toBe(201);
// //     expect(response.body.content).toBe(comment.content);
// //     expect(response.body.owner).toBe(user._id);
// //     expect(response.body.postId).toBe(post._id.toString());

// //     // Store the comment ID for further testing
// //     commentId = response.body._id;
// //   });

// //   test("GET /comments", async () => {
// //     const response = await request(app)
// //       .get("/comments");

// //     expect(response.statusCode).toBe(200);
// //     expect(Array.isArray(response.body)).toBe(true);
// //     expect(response.body.length).toBeGreaterThan(0);
// //   });

// //   test("GET /comments/:id", async () => {
// //     const response = await request(app)
// //       .get(`/comments/${commentId}`);

// //     expect(response.statusCode).toBe(200);
// //     expect(response.body.content).toBe(comment.content);
// //     expect(response.body.owner).toBe(user._id);
// //     expect(response.body.postId).toBe(post._id.toString());
// //   });

// //   test("PUT /comments/:id", async () => {
// //     const updatedComment = { content: "Updated comment" };

// //     const response = await request(app)
// //       .put(`/comments/${commentId}`)
// //       .send(updatedComment);

// //     expect(response.statusCode).toBe(200);
// //     expect(response.body.content).toBe(updatedComment.content);
// //     expect(response.body.owner).toBe(user._id);
// //     expect(response.body.postId).toBe(post._id.toString());
// //   });

// //   test("DELETE /comments/:id", async () => {
// //     const response = await request(app)
// //       .delete(`/comments/${commentId}`)
// //       .set("Cookie", accessTokenCookie);

// //     expect(response.statusCode).toBe(200);
// //     expect(response.body._id).toBe(commentId);
// //   });
// // });

