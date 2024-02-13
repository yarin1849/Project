"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const app_user_controller_1 = __importDefault(require("../controllers/app_user_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
router.get("/", auth_middleware_1.default, app_user_controller_1.default.get.bind(app_user_controller_1.default));
router.get("/:id", auth_middleware_1.default, app_user_controller_1.default.getById.bind(app_user_controller_1.default));
router.post("/", auth_middleware_1.default, app_user_controller_1.default.post.bind(app_user_controller_1.default));
router.put("/:id", app_user_controller_1.default.putById.bind(app_user_controller_1.default));
router.delete("/:id", auth_middleware_1.default, app_user_controller_1.default.deleteById.bind(app_user_controller_1.default));
exports.default = router;
//# sourceMappingURL=user_route.js.map