import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
//import Student from "../models/user_model";
import { Express } from "express";
import Users from "../models/user_model";
import User, { IUser } from "../models/user_model";

let app: Express;
let accessToken: string;
/*const user = {
  email: "testStudent@test.com",
  password: "1234567890",
}*/
beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await Users.deleteMany();
  
  User.deleteMany({ 'email': student.email });
  await request(app).post("/auth/register").send(student);
  const response = await request(app).post("/auth/login").send(student);
  accessToken = response.body.accessToken;
});

afterAll(async () => {
  await mongoose.connection.close();
});

const student: IUser = {
  name: "Joe 123",
  _id : "33",
  email: "abc@test.com",
  password: "A00000000"
};

describe("Student tests", () => {
  const addStudent = async (student: IUser) => {
    const response = await request(app).post("/user").set("Authorization", "JWT " + accessToken).send(student);
    expect(response.statusCode).toBe(201);
    expect(response.text).toBe("OK");
  };
  // test("Test Get All Students - empty response", async () => {
  //   const response = await request(app).get("/user").set("Authorization", "JWT " + accessToken);
  //   expect(response.statusCode).toBe(200);
  //   expect(response.body).toStrictEqual([]);
  // });
  

  test("Test Post Student", async () => {
    addStudent(student);
  });

  test("Test Get All Students with one student in DB", async () => {
    const response = await request(app).get("/user").set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    const st = response.body[0];
    //console.log(response.body);
    expect(st.name).toBe(student.name);
    expect(st.email).toBe(student.email);
    expect(st.password).toBe(student.password);
    expect(st._id).toBe(student._id);
  });

  test("Test Post duplicate Student", async () => {
    const response = await request(app).post("/user").set("Authorization", "JWT " + accessToken).send(student);
    expect(response.statusCode).toBe(406);
  });

  // test("Test PUT /student/:id", async () => {
  //   const updatedStudent = { ...student, name: "Jane Doe 33" };
  //   const response = await request(app)
  //     .put("/user/" + student._id)
  //     .set("Authorization", "JWT " + accessToken)
  //     .send(updatedStudent);
  //   expect(response.statusCode).toBe(200);
  //   expect(response.body.name).toBe(updatedStudent.name);
  // });

  // test("Test DELETE /student/:id", async () => {
  //   const response = await request(app).delete(`/student/${student._id}`);
  //   expect(response.statusCode).toBe(200);
  // });
});
