"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const comment_controller_1 = __importDefault(require("../controllers/comment_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
router.post("/", auth_middleware_1.default, comment_controller_1.default.post.bind(comment_controller_1.default));
exports.default = router;
//# sourceMappingURL=comment_route.js.map