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
const user_model_1 = __importDefault(require("../models/user_model"));
const user_model_2 = __importDefault(require("../models/user_model"));
let app;
let accessToken;
/*const user = {
  email: "testStudent@test.com",
  password: "1234567890",
}*/
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("beforeAll");
    yield user_model_1.default.deleteMany();
    user_model_2.default.deleteMany({ 'email': student.email });
    yield (0, supertest_1.default)(app).post("/auth/register").send(student);
    const response = yield (0, supertest_1.default)(app).post("/auth/login").send(student);
    accessToken = response.body.accessToken;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
const student = {
    name: "Joe 123",
    _id: "33",
    email: "abc@test.com",
    password: "A00000000"
};
describe("Student tests", () => {
    const addStudent = (student) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/user").set("Authorization", "JWT " + accessToken).send(student);
        expect(response.statusCode).toBe(201);
        expect(response.text).toBe("OK");
    });
    // test("Test Get All Students - empty response", async () => {
    //   const response = await request(app).get("/user").set("Authorization", "JWT " + accessToken);
    //   expect(response.statusCode).toBe(200);
    //   expect(response.body).toStrictEqual([]);
    // });
    test("Test Post Student", () => __awaiter(void 0, void 0, void 0, function* () {
        addStudent(student);
    }));
    test("Test Get All Students with one student in DB", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/user").set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        const st = response.body[0];
        //console.log(response.body);
        expect(st.name).toBe(student.name);
        expect(st.email).toBe(student.email);
        expect(st.password).toBe(student.password);
        expect(st._id).toBe(student._id);
    }));
    test("Test Post duplicate Student", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/user").set("Authorization", "JWT " + accessToken).send(student);
        expect(response.statusCode).toBe(406);
    }));
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
//# sourceMappingURL=user.test.js.map