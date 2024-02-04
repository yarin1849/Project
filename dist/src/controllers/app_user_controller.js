"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_user_model_1 = __importDefault(require("../models/app_user_model"));
const base_controller_1 = __importDefault(require("./base_controller"));
const studentController = (0, base_controller_1.default)(app_user_model_1.default);
exports.default = studentController;
//# sourceMappingURL=app_user_controller.js.map