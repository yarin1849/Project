"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../app"));
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
let app;
beforeAll(async () => {
    app = await (0, app_1.default)();
    console.log("beforeAll");
});
afterAll(async () => {
    await mongoose_1.default.connection.close();
});
describe("File Tests", () => {
    test("upload file", async () => {
        const filePath = `${__dirname}/robo.jpg`;
        console.log(filePath);
        try {
            const response = await (0, supertest_1.default)(app)
                .post("/file?file=123.webp")
                .attach("file", filePath);
            expect(response.statusCode).toEqual(200);
            let url = response.body.url;
            console.log(url);
            url = url.replace(/^.*\/\/[^/]+/, "");
            const res = await (0, supertest_1.default)(app).get(url);
            expect(res.statusCode).toEqual(200);
        }
        catch (err) {
            console.log(err);
            expect(1).toEqual(2);
        }
    });
});
//# sourceMappingURL=file.test.js.map