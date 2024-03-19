"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// controllers/userLocation.controller.js
const location_model_1 = __importDefault(require("../models/location_model"));
const userLocationController = {
    createUserLocation: async (req, res) => {
        try {
            const { userId, coordinates } = req.body;
            const userLocation = new location_model_1.default({ user: userId, coordinates });
            await userLocation.save();
            res.status(201).json(userLocation);
        }
        catch (error) {
            console.error('Error creating user location:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    getUserLocation: async (req, res) => {
        try {
            const userId = req.params.userId;
            const userLocation = await location_model_1.default.findOne({ userId });
            if (!userLocation) {
                return res.status(404).json({ message: 'User location not found' });
            }
            res.status(200).json(userLocation);
        }
        catch (error) {
            console.error('Error fetching user location:', error);
            res.status(500).json({ message: 'Failed to fetch user location' });
        }
    },
    updateUserLocation: async (req, res) => {
        try {
            const userId = req.params.userId;
            const { latitude, longitude } = req.body;
            let userLocation = await location_model_1.default.findOne({ userId });
            if (!userLocation) {
                userLocation = new location_model_1.default({ userId, latitude, longitude });
            }
            else {
                userLocation.latitude = latitude;
                userLocation.longitude = longitude;
            }
            await userLocation.save();
            res.status(200).json({ message: 'User location updated successfully' });
        }
        catch (error) {
            console.error('Error updating user location:', error);
            res.status(500).json({ message: 'Failed to update user location' });
        }
    },
    deleteUserLocation: async (req, res) => {
        try {
            const userId = req.params.userId;
            await location_model_1.default.deleteOne({ userId });
            res.status(200).json({ message: 'User location deleted successfully' });
        }
        catch (error) {
            console.error('Error deleting user location:', error);
            res.status(500).json({ message: 'Failed to delete user location' });
        }
    }
};
exports.default = userLocationController;
//# sourceMappingURL=userLocation_controller.js.map