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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user_model"));
const base_controller_1 = require("./base_controller");
class UserController extends base_controller_1.BaseController {
    constructor() {
        super(user_model_1.default);
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Get Connected User: ");
            const id = req.user._id;
            try {
                const user = yield user_model_1.default.findById(id).select([
                    "name",
                    "email",
                    "imgUrl",
                ]);
                res.send(user); // Send the user object
            }
            catch (err) {
                res.status(500).json({ message: "unable to retrieve user data" });
            }
        });
    }
    putById2(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Put User", req.body);
            const id = req.user._id;
            try {
                const updatedUser = yield this.model.findByIdAndUpdate(id, req.body, {
                    new: true,
                });
                const updatedUserWithoutPassword = __rest(updatedUser.toObject(), []);
                res.status(200).send(updatedUserWithoutPassword);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
}
exports.default = new UserController();
//# sourceMappingURL=user_controller.js.map