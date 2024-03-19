"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
//import studentRoute from "./routes/student_route";
const post_route_1 = __importDefault(require("./routes/post_route"));
const user_route_1 = __importDefault(require("./routes/user_route"));
const auth_route_1 = __importDefault(require("./routes/auth_route"));
const comment_route_1 = __importDefault(require("./routes/comment_route"));
const file_route_1 = __importDefault(require("./routes/file_route"));
const location_route_1 = __importDefault(require("./routes/location_route"));
//import cors from "cors";
const initApp = () => {
    const promise = new Promise((resolve) => {
        const db = mongoose_1.default.connection;
        db.once("open", () => console.log("Connected to Database"));
        db.on("error", (error) => console.error(error));
        const url = process.env.DB_URL;
        mongoose_1.default.connect(url).then(() => {
            const app = (0, express_1.default)();
            app.use(body_parser_1.default.json({ limit: "50mb" }));
            app.use(body_parser_1.default.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
            app.use((req, res, next) => {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Methods", "*");
                res.header("Access-Control-Allow-Headers", "*");
                next();
            });
            //app.use("/student", studentRoute);
            app.use("/user", user_route_1.default);
            app.use("/userpost", post_route_1.default);
            app.use("/auth", auth_route_1.default);
            app.use("/comments", comment_route_1.default);
            app.use("/file", file_route_1.default);
            app.use("/user-locations", location_route_1.default);
            app.use("/public", express_1.default.static("public"));
            //app.use(cors())
            resolve(app);
        });
    });
    return promise;
};
exports.default = initApp;
//# sourceMappingURL=app.js.map