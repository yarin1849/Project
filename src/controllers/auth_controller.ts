import { Request, Response } from 'express';
import User, { IUser } from '../models/user_model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Document } from 'mongoose';
import {OAuth2Client} from 'google-auth-library';

const accessTokenExpiration = parseInt(process.env.JWT_EXPIRATION_MILL);

const client = new OAuth2Client();
const googleSignin = async (req: Request, res: Response) => {
    console.log(req.body);
    try {
        const ticket = await client.verifyIdToken({
            idToken: req.body.credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload?.email;
        if (email != null) {
            let user = await User.findOne({ 'email': email });
            if (user == null) {
                user = await User.create({
                    'name': payload?.name,
                    'email': email,
                    'imgUrl': payload?.picture,
                    'password': '1234'
                });
            }
            const tokens = await generateTokens(user)
            res.cookie("refresh", tokens.refreshToken, {
                httpOnly: true,
                path: "/auth",
            });
            res.cookie("access", tokens.accessToken, {
                httpOnly: true,
                maxAge: accessTokenExpiration,
            });
            return res.status(200).send({
                name: user.name,
                email: user.email,
                _id: user._id,
                imgUrl: user.imgUrl,
                ...tokens
            });
        } else {
            // Handle unexpected conditions
            return res.status(400).send("Email is null or empty");
        }
    } catch (err) {
        return res.status(401).send(err.message);
    }
}

const register = async (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const imgUrl = req.body.imgUrl;
    if (!email || !password || !name) {
        return res.status(400).send("missing email or password");
    }
    try {
        const rs = await User.findOne({ 'email': email });
        if (rs != null) {
            return res.status(406).send("email already exists");
        }
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);
        const rs2 = await User.create(
            {
                'name' : name,
                'email': email,
                'password': encryptedPassword,
                'imgUrl': imgUrl
            });
        const tokens = await generateTokens(rs2)
        res.cookie("refresh", tokens.refreshToken, {
            httpOnly: true,
            path: "/auth",
          });
          res.cookie("access", tokens.accessToken, {
            httpOnly: true,
            maxAge: accessTokenExpiration,
          });
        res.status(201).send(
            {
                name: rs2.name,
                email: rs2.email,
                _id: rs2._id,
                imgUrl: rs2.imgUrl,
                ...tokens
            });
           // return res.status(201).send(rs2)
    } catch (err) {
        return res.status(400).send("error missing email or password");
    }
}

const generateTokens = async (user: Document & IUser) => {
    const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
        });
        const refreshToken = jwt.sign({ _id: user._id },process.env.JWT_REFRESH_SECRET);
        if (user.refreshTokens == null) {
        user.refreshTokens = [refreshToken];
        } else if (!user.refreshTokens.includes(refreshToken)) {
        user.refreshTokens.push(refreshToken);
        }
        await user.save();
        return {
        accessToken,
        refreshToken,
    };
  };

const login = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.status(400).send("missing email or password");
    }
    try {
        const user = await User.findOne({ 'email': email });
        if (user == null) {
            return res.status(401).send("email or password incorrect");
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).send("email or password incorrect");
        }

        const tokens = await generateTokens(user)
        res.cookie("refresh", tokens.refreshToken, {
            httpOnly: true,
            path: "/auth",
          });
          res.cookie("access", tokens.accessToken, {
            httpOnly: true,
            maxAge: accessTokenExpiration,
          });
        return res.status(200).send(tokens);
    } catch (err) {
        return res.status(400).send("error missing email or password");
    }
}

const logout = async (req: Request, res: Response) => {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (refreshToken == null) return res.sendStatus(401);
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, user: { '_id': string }) => {
        console.log(err);
        if (err) return res.sendStatus(401);
        try {
            const userDb = await User.findOne({ '_id': user._id });
            if (!userDb.refreshTokens || !userDb.refreshTokens.includes(refreshToken)) {
                userDb.refreshTokens = [];
                await userDb.save();
                return res.status(401).send("Invalid refresh token");
            } else {
                userDb.refreshTokens = userDb.refreshTokens.filter(t => t !== refreshToken);
                await userDb.save();
                return res.sendStatus(200);
            }
        } catch (err) {
            res.status(400).send(err.message);
        }
    });
}


const refresh = async (req: Request, res: Response) => {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (refreshToken == null) return res.sendStatus(401);
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, user: { '_id': string }) => {
        if (err) {
            console.log(err);
            return res.sendStatus(401);
        }
        try {
            const userDb = await User.findOne({ '_id': user._id });
            if (!userDb.refreshTokens || !userDb.refreshTokens.includes(refreshToken)) {
                userDb.refreshTokens = [];
                await userDb.save();
                return res.sendStatus(401);
            }
            const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
            const newRefreshToken = jwt.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET);
            userDb.refreshTokens = userDb.refreshTokens.filter(t => t !== refreshToken);
            userDb.refreshTokens.push(newRefreshToken);
            await userDb.save();

            res.cookie("refresh", newRefreshToken, {
                httpOnly: true,
                path: "/auth",
              });
              res.cookie("access", accessToken, {
                httpOnly: true,
                maxAge: accessTokenExpiration,
              });

            return res.status(200).send({
                'accessToken': accessToken,
                'refreshToken': newRefreshToken  // Use the new refresh token here
            });
        } catch (err) {
            return res.status(401).send(err.message);  // Return the error response properly
        }
    });

}

export default {
    googleSignin,
    register,
    login,
    logout,
    refresh
}