"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/userLocation.routes.js
const express_1 = __importDefault(require("express"));
const userLocation_controller_1 = __importDefault(require("../controllers/userLocation_controller"));
const router = express_1.default.Router();
router.post('/user-locations', userLocation_controller_1.default.createUserLocation);
router.get('/user-locations/:userId', userLocation_controller_1.default.getUserLocation);
router.put('/user-locations/:userId', userLocation_controller_1.default.updateUserLocation);
router.delete('/user-locations/:userId', userLocation_controller_1.default.deleteUserLocation);
exports.default = router;
//# sourceMappingURL=location_route.js.map