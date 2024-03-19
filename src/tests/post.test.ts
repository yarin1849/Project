import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import Post, { IPost } from "../models/post_model";
import User, { IUser } from "../models/user_model";
import Comment from "../models/comment_model";

let app: Express;
const user: IUser = {
  name: "test test",
  email: "test@student.post.test",
  password: "1234567890",
}
const user2: IUser = {
  name: "user1 test2",
  email: "test22@student.post.test",
  password: "123456789220",
}
let accessToken = "";

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await Post.deleteMany();

  await User.deleteMany({ 'email': user.email });
  const response = await request(app).post("/auth/register").send(user);
  user._id = response.body._id;
  const response2 = await request(app).post("/auth/login").send(user);
  accessToken = response2.body.accessToken;
  const postedUser = await User.findOne({ email: user.email });
  user._id = postedUser._id;
  post.owner = user._id;
  // const postedReview = await Post.create(post);
  // post._id = postedReview._id;
  post2.owner = Object('65f840b754df15a4203728a4');
  user2._id = response.body._id;
  post3.owner = user2._id;
});
afterAll(async () => {
  await mongoose.connection.close();
});

const post: IPost = {
  title: "My visit to Tiberias",
  message: "my fisrt description of posts bla bla eksdf bsakd mewkfm ",
  comments: [],
  postImg:"http://localhost:3000/public\\1710188179618.jpg",
};

const post2: IPost = {
  title: "Best- Jerusalem22",
  message: "Visitors can explore the narrow streets of the Jewish, Christian, Armenian, and Muslim quarters, soak in the vibrant atmosphere of the markets, and immerse themselves in the city's profound religious and historical significance.",
  owner: user._id,
  comments: [],
  postImg: "http://localhost:3000/public\\1710188157651.jpg",
};

// post2.comments.push({
//   _id: user._id, 
//   owner: user._id, 
//   content: "This is a great post!",
//   postId: post2._id, 
//   createdAt: new Date() 
// });


const post3: IPost = {
  title: "Best- Tel aviv2",
  message: "Visitors can explore the narrow streets of the Jewish, Christian, Armenian, and Muslim quarters, soak in the vibrant atmosphere of the markets, and immerse themselves in the city's profound religious and historical significance.",
  owner: user._id,
  comments: [],
  postImg: "http://localhost:3000/public\\1710188157651.jpg",
};



describe("Post tests", () => {
  const addPost = async (post: IPost) => {
    const response = await request(app)
      .post("/userpost")
      .set("Authorization", "JWT " + accessToken)
      .send(post);
    expect(response.statusCode).toBe(201);
    //expect(response.body.owner).toBe(user._id);
    expect(response.body.title).toBe(post.title);
    expect(response.body.message).toBe(post.message);
  };


  test("Test post", async () => {
    await addPost(post);
  });

  test("Test post2", async () => {
    await addPost(post2);
  });
  test("Test post2", async () => {
    const post2Response = await request(app)
      .post("/userpost")
      .set("Authorization", "JWT " + accessToken)
      .send(post2);
  
    expect(post2Response.statusCode).toBe(201);
    const createdPost2 = post2Response.body;
    // Add a comment to the created post
    const newComment = new Comment({
      owner: user._id,
      content: "This is second commenttest test",
      postId: createdPost2._id,
      createdAt: new Date(),
    });
    
    newComment.save()
      .then(savedComment => {
        console.log("Comment saved:", savedComment);
        // Handle success
      })
      .catch(error => {
        console.error("Error saving comment:", error);
        // Handle error
      });
    createdPost2.comments.push(newComment);
  
    const updatePostResponse = await request(app)
      .put(`/userpost/${createdPost2._id}`)
      .set("Authorization", "JWT " + accessToken)
      .send(createdPost2);
  
    expect(updatePostResponse.statusCode).toBe(200);
  });
  
  test("Test post3", async () => {
    const post3Response = await request(app)
      .post("/userpost")
      .set("Authorization", "JWT " + accessToken)
      .send(post3);
  
    expect(post3Response.statusCode).toBe(201);
    const createdPost3 = post3Response.body;
    const comment = {
      _id: user._id,
      owner: user._id,
      content: "This is second commenttest test",
      postId: createdPost3._id,
      createdAt: new Date(),
    };
  
    createdPost3.comments.push(comment);
  
    const updatePostResponse = await request(app)
      .put(`/userpost/${createdPost3._id}`)
      .set("Authorization", "JWT " + accessToken)
      .send(createdPost3);
  
    expect(updatePostResponse.statusCode).toBe(200);
  });
  

 
  test("Get all posts from the database", async () => {
    const allPosts = await Post.find();
    expect(allPosts.length).toBeGreaterThan(0);

});
test("Retrieve all posts from the database", async () => {
  const response = await request(app).get("/userpost");
  expect(response.statusCode).toBe(200);
  expect(response.body.length).toBeGreaterThan(0);
});

test("Get post by ID", async () => {
  // Add a post first
  const postResponse = await request(app)
    .post("/userpost")
    .set("Authorization", "JWT " + accessToken)
    .send(post);
  expect(postResponse.statusCode).toBe(201);
  const postId = postResponse.body._id;

  // get post by ID
  const getByIdResponse = await request(app).get(`/userpost/${postId}`);
  expect(getByIdResponse.statusCode).toBe(200);
  expect(getByIdResponse.body.title).toBe(post.title);
  expect(getByIdResponse.body.message).toBe(post.message);
});


test("Catch error in get method", async () => {
  // Simulate an error by passing an invalid query parameter
  const response = await request(app).get("/userpost/invalid-endpoint");
  expect(response.statusCode).toBe(500);
  expect(response.body.message).toBeDefined();
});

test("Catch error in getById method", async () => {
  const response = await request(app).get("/userpost/invalid_id");
  expect(response.statusCode).toBe(500);
  expect(response.body.message).toBeDefined();
});


test("Test Update Post", async () => {
  const createdPost = await Post.findOne({ title: "My visit to Tiberias" });
  const postId = createdPost?._id;

  // Update the title of the post
  const updatedTitle = "Updated Title";
  const response = await request(app)
    .put(`/userpost/${postId}`) 
    .set("Authorization", "JWT " + accessToken)
    .send({ title: updatedTitle });

  expect(response.statusCode).toBe(200);
  const updatedPost = await Post.findById(postId);
  expect(updatedPost?.title).toBe(updatedTitle);
});


test("Test Delete Post by ID - Post Found", async () => {
  //     // Make a request to create a post
      const postResponse = await request(app)
        .post("/userpost")
        .set("Authorization", "JWT " + accessToken)
        .send(post);
      expect(postResponse.statusCode).toBe(201);
    
      // Extract the created post ID
      const postId = postResponse.body._id;
  
      const deleteResponse = await request(app).delete(`/userpost/${postId}`)
        .set("Authorization", "JWT " + accessToken);
      
      // Assert the status code and the response body
      expect(deleteResponse.statusCode).toBe(200);
      expect(deleteResponse.body._id).toBe(postId);
    });
  

});
