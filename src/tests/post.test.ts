import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import Post, { IPost } from "../models/post_model";
import User, { IUser } from "../models/user_model";

let app: Express;
const user: IUser = {
  name: "test test",
  email: "test@student.post.test",
  password: "1234567890",
}

const user2: IUser = {
  name: "test2 test2",
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
  post2.owner = user._id;
  user2._id = response.body._id;
  post3.owner = user2._id;
});
afterAll(async () => {
  await mongoose.connection.close();
});

const post: IPost = {
  title: "my seccc post here",
  message: "my fisrt description of posts",
  comments: [],
  postImg:"http://localhost:3000/public\\1710188157651.jpg",
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
    const comment = {
      _id: user._id,
      owner: user._id,
      content: "This is a great post! test test",
      postId: createdPost2._id,
      createdAt: new Date(),
    };
  
    createdPost2.comments.push(comment);
  
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
    // Retrieve all posts from the database
    const allPosts = await Post.find();
    // Assert that there are posts
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
  // Send a request to retrieve an object with an invalid ID
  const response = await request(app).get("/userpost/invalid_id");
  expect(response.statusCode).toBe(500);
  expect(response.body.message).toBeDefined();
});


test("Test Update Post", async () => {
  // Retrieve the ID of the created post
  const createdPost = await Post.findOne({ title: "my seccc post here" });
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

//##################################################################
// import { Express } from "express";
// import request from "supertest";
// import initApp from "../app";
// import mongoose from "mongoose";
// import User, { IUser } from "../models/user_model";
// import Post, { IPost } from "../models/post_model";

// let app: Express;
// let accessToken = "";
// let user: IUser;
// let post1: IPost;

// beforeAll(async () => {
//   app = await initApp();
//   console.log("beforeAll");
//   await Post.deleteMany();
//   await User.deleteMany({ 'email': 'test@.post.test' });

//   // Register a user
//   const registerResponse = await request(app).post("/auth/register").send({
//     name: "bla",
//     email: "test@.post.test",
//     password: "1234567890",
//   });
//   user = registerResponse.body;

//   // Login to get the access token
//   const loginResponse = await request(app).post("/auth/login").send({
//     email: user.email,
//     password: "1234567890",
//   });
//   accessToken = loginResponse.body.accessToken;

//   // Create a post
//   post1 = {
//     comments: [],
//     title: "First Visit to Haifa-Bahá'í Gardens2233",
//     message: "This UNESCO World Heritage Site is a stunning terraced garden that surrounds the Shrine of the Báb, a holy site for the Bahá'í Faith. The gardens offer breathtaking views of the city and the Mediterranean Sea.",
//     owner: user._id,
//     postImg: "http://localhost:3000/public\\1710188202692.jpg",
//   };
// });

// afterAll(async () => {
//   await mongoose.connection.close();
// });

// describe("Post controller tests", () => {
//   test("Test Get All  posts - empty response", async () => {
//     const response = await request(app).get("/userpost");
//     expect(response.statusCode).toBe(200);
//     expect(response.body).toStrictEqual([]);
//   });

//   test("Test Post", async () => {
//     const newPost1: IPost = {
//       comments: [],
//       title: "This is my first post",
//       message: "this is my firs description about the post",
//       owner: user._id,
//       postImg: "http://localhost:3000/public\\1710188157651.jpg",
//     };
  
//     const response = await request(app)
//       .post("/userpost")
//       .set("Authorization", "JWT " + accessToken)
//       .send(newPost1);
  
//     expect(response.statusCode).toBe(201);
//     expect(response.body.owner).toBe(user._id);
//     expect(response.body.title).toBe(newPost1.title);
//     expect(response.body.message).toBe(newPost1.message);
//   });
  

//   test("Test Get All user posts with one post in DB", async () => {
//     const response = await request(app).get("/userpost");
//     expect(response.statusCode).toBe(200);
//     const rc = response.body[0];
//     expect(rc.title).toBe(post1.title);
//     expect(rc.message).toBe(post1.message);
//     expect(rc.owner).toBe(user._id);
//   });

//   test("Test PUT /userpost/:id", async () => {
//     const updatedPost: IPost = {
//       comments: [],
//       title: "updatedTitle",
//       message: "updatedMessage",
//       owner: user._id,
//       postImg: "postImg1",
//     };
//     const response = await request(app)
//       .put(`/userpost/${post1._id}`)
//       .set("Authorization", "JWT " + accessToken)
//       .send(updatedPost);
//     expect(response.statusCode).toBe(200);
//     expect(response.body.title).toBe(updatedPost.title);
//     expect(response.body.message).toBe(updatedPost.message);
//     expect(response.body.owner).toBe(user._id);
//   });

//   // test("Test DELETE /userpost/:id", async () => {
//   //   const response = await request(app).delete(`/userpost/${post1._id}`)
//   //     .set("Authorization", "JWT " + accessToken);
//   //   expect(response.statusCode).toBe(200);
//   // });
  

//   test("Test Get All  posts - existing posts", async () => {
//     // Create some posts
//     const post2 = {
//       title: "Best- Jerusalem22",
//       message: "Visitors can explore the narrow streets of the Jewish, Christian, Armenian, and Muslim quarters, soak in the vibrant atmosphere of the markets, and immerse themselves in the city's profound religious and historical significance.",
//       owner: '65ef66f07c8f9f3f7689e9d2',
//       comments: [],
//       postImg: "http://localhost:3000/public\\1710188157651.jpg",
//     };
//     const post3 = {
//       title: "Tel Aviv Beaches22",
//       message: "message33 some message here",
//       owner: '65ef66f07c8f9f3f7689e9d2',
//       comments: [],
//       postImg: "http://localhost:3000/public\\1710188183765.jpg",
//     };

//     await request(app)
//       .post("/userpost")
//       .set("Authorization", "JWT " + accessToken)
//       .send(post2);

//     await request(app)
//       .post("/userpost")
//       .set("Authorization", "JWT " + accessToken)
//       .send(post3);

//     const response = await request(app).get("/userpost");
//     expect(response.statusCode).toBe(200);
//    //expect(response.body.length).toBe(3); // Expecting 3 posts including the previously created post1
   
//   const createdPosts = response.body;
//   expect(createdPosts.length).toBeGreaterThan(0);
//   });
//   test("Test Post 2 new Posts ", async () => {
//     // Create some posts
//     const post2 = {
//       title: "title2",
//       message: "message2",
//       owner: '1234',
//     };
//     const post3 = {
//       title: "title3",
//       message: "message3",
//       owner: '123456',
//     };

//     await request(app)
//       .post("/userpost")
//       .set("Authorization", "JWT " + accessToken)
//       .send(post2);

//     await request(app)
//       .post("/userpost")
//       .set("Authorization", "JWT " + accessToken)
//       .send(post3);

//     const response = await request(app).post("/userpost");
//     //expect(response.statusCode).toBe(200);
//     expect(response.body.length).toBeGreaterThan(2); // Expecting 3 posts including the previously created post1
   
//   const createdPosts = response.body;
//   expect(createdPosts.length).toBeGreaterThan(0);
//   });

//   test("Test Get User post by ID", async () => {
//     // First, create a post
//     const response = await request(app)
//       .post("/userpost")
//       .set("Authorization", "JWT " + accessToken)
//       .send(post1);
//     expect(response.statusCode).toBe(201);

//     // Then, retrieve the created post by ID
//     const createdPostId = response.body._id;
//     const getByIdResponse = await request(app).get(`/userpost/${createdPostId}`);
//     expect(getByIdResponse.statusCode).toBe(200);
//     expect(getByIdResponse.body.title).toBe(post1.title);
//     expect(getByIdResponse.body.message).toBe(post1.message);
//     expect(getByIdResponse.body.owner).toBe(user._id);
//   });


//   // test("Test Post", async () => {
//   //   const response = await request(app)
//   //     .post("/userpost")
//   //     .set("Authorization", "JWT " + accessToken)
//   //     .send(post1);
//   //   expect(response.statusCode).toBe(201);
//   //   expect(response.body.owner).toBe(user._id);
//   //   expect(response.body.title).toBe(post1.title);
//   //   expect(response.body.message).toBe(post1.message);
//   // });
  
//   test("Test Get Post by ID - Post Found", async () => {
//     // Make a request to create a post
//     const postResponse = await request(app)
//       .post("/userpost")
//       .set("Authorization", "JWT " + accessToken)
//       .send(post1);
//     expect(postResponse.statusCode).toBe(201);
  
//     // Extract the created post ID
//     const postId = postResponse.body._id;
  
//     // Make a request to retrieve the created post by ID using getById2
//     const getByIdResponse = await request(app).get(`/userpost/${postId}`);
    
//     // Assert the status code and the properties of the returned post
//     expect(getByIdResponse.statusCode).toBe(200);
//     expect(getByIdResponse.body.title).toBe(post1.title);
//     expect(getByIdResponse.body.message).toBe(post1.message);
//     expect(getByIdResponse.body.owner).toBe(user._id);
//   });
  
  
//   test("Test Delete Post by ID - Post Found", async () => {
//     // Make a request to create a post
//     const postResponse = await request(app)
//       .post("/userpost")
//       .set("Authorization", "JWT " + accessToken)
//       .send(post1);
//     expect(postResponse.statusCode).toBe(201);
  
//     // Extract the created post ID
//     const postId = postResponse.body._id;
  
//     // Make a request to delete the created post by ID
//     const deleteResponse = await request(app).delete(`/userpost/${postId}`)
//       .set("Authorization", "JWT " + accessToken);
    
//     // Assert the status code and the response body
//     expect(deleteResponse.statusCode).toBe(200);
//     expect(deleteResponse.body._id).toBe(postId);
//   });


// });
