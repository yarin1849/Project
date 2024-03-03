"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user_model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const imgUrl = req.body.imgUrl;
    if (!email || !password || !name) {
        return res.status(400).send("missing email or password");
    }
    try {
        const rs = await user_model_1.default.findOne({ 'email': email });
        if (rs != null) {
            return res.status(406).send("email already exists");
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const encryptedPassword = await bcrypt_1.default.hash(password, salt);
        const rs2 = await user_model_1.default.create({
            'name': name,
            'email': email,
            'password': encryptedPassword,
            'imgUrl': imgUrl
        });
        const tokens = await generateTokens(rs2);
        res.status(201).send(Object.assign({ name: rs2.name, email: rs2.email, _id: rs2._id, imgUrl: rs2.imgUrl }, tokens));
    }
    catch (err) {
        return res.status(400).send("error missing email or password");
    }
};
const generateTokens = async (user) => {
    const accessToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
    });
    const refreshToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET);
    if (user.refreshTokens == null) {
        user.refreshTokens = [refreshToken];
    }
    else if (!user.refreshTokens.includes(refreshToken)) {
        user.refreshTokens.push(refreshToken);
    }
    await user.save();
    return {
        accessToken,
        refreshToken,
    };
};
const login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.status(400).send("missing email or password");
    }
    try {
        const user = await user_model_1.default.findOne({ 'email': email });
        if (user == null) {
            return res.status(401).send("email or password incorrect");
        }
        const match = await bcrypt_1.default.compare(password, user.password);
        if (!match) {
            return res.status(401).send("email or password incorrect");
        }
        const tokens = await generateTokens(user);
        return res.status(200).send(tokens);
    }
    catch (err) {
        return res.status(400).send("error missing email or password");
    }
};
const logout = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (refreshToken == null)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, user) => {
        console.log(err);
        if (err)
            return res.sendStatus(401);
        try {
            const userDb = await user_model_1.default.findOne({ '_id': user._id });
            if (!userDb.refreshTokens || !userDb.refreshTokens.includes(refreshToken)) {
                userDb.refreshTokens = [];
                await userDb.save();
                return res.status(401).send("Invalid refresh token");
            }
            else {
                userDb.refreshTokens = userDb.refreshTokens.filter(t => t !== refreshToken);
                await userDb.save();
                return res.sendStatus(200);
            }
        }
        catch (err) {
            res.status(400).send(err.message);
        }
    });
};
const refresh = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (refreshToken == null)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, user) => {
        if (err) {
            console.log(err);
            return res.sendStatus(401);
        }
        try {
            const userDb = await user_model_1.default.findOne({ '_id': user._id });
            if (!userDb.refreshTokens || !userDb.refreshTokens.includes(refreshToken)) {
                userDb.refreshTokens = [];
                await userDb.save();
                return res.sendStatus(401);
            }
            const accessToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
            const newRefreshToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET);
            userDb.refreshTokens = userDb.refreshTokens.filter(t => t !== refreshToken);
            userDb.refreshTokens.push(newRefreshToken);
            await userDb.save();
            return res.status(200).send({
                'accessToken': accessToken,
                'refreshToken': newRefreshToken // Use the new refresh token here
            });
        }
        catch (err) {
            return res.status(401).send(err.message); // Return the error response properly
        }
    });
};
exports.default = {
    register,
    login,
    logout,
    refresh
};
//# sourceMappingURL=auth_controller.js.map