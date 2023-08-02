"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//GENERAL
const express_1 = require("express");
const userRoute = (0, express_1.Router)();
// import { validateCharacter } from "../../validation/char";
const bcryptjs_1 = require("bcryptjs");
const user_1 = __importDefault(require("../../models/user"));
const auth_1 = require("../../utils/auth");
const multer_1 = __importDefault(require("multer"));
const mongodb_1 = require("mongodb");
//admin middleware
userRoute.get("/", async (req, res, next) => {
    try {
        const allCharacters = await user_1.default.find();
        res.send(allCharacters);
    }
    catch (e) {
        next(e);
    }
});
userRoute.get("/me", auth_1.authMidd, async (req, res, next) => {
    try {
        res.send(req.user);
    }
    catch (error) {
        next(error);
    }
});
userRoute.post("/login", async ({ body }, res, next) => {
    try {
        console.log(body);
        let foundUser = await user_1.default.findOne({
            where: {
                email: body.email,
            },
        });
        if (foundUser && (await (0, bcryptjs_1.compare)(body.password, foundUser.password))) {
            const token = await (0, auth_1.generateJWT)({
                lastName: foundUser.lastName,
                email: foundUser.email,
            });
            res
                .set("Access-Control-Expose-Headers", "token")
                .set("token", token)
                .send(200);
        }
        else
            res.send(404);
    }
    catch (error) {
        next(error);
    }
});
userRoute.get("/:id", async (req, res, next) => {
    try {
        const selectedUser = await user_1.default.findById(req.params.id);
        res.send(selectedUser);
    }
    catch (e) {
        next(e);
    }
});
userRoute.patch("/:id/:courseId", auth_1.authMidd, async (req, res, next) => {
    try {
        const user = await user_1.default.findById(req.params.id).populate("favs");
        if (user.favs.some((el) => new mongodb_1.ObjectId(el._id).equals(new mongodb_1.ObjectId(req.params.courseId)))) {
            await user_1.default.findByIdAndUpdate(req.params.id, {
                $pullAll: {
                    favs: [req.params.courseId]
                }
            });
        }
        else {
            await user_1.default.findByIdAndUpdate(req.params.id, {
                $push: {
                    favs: req.params.courseId
                }
            });
        }
        res.sendStatus(204);
    }
    catch (error) {
        console.log(error);
        next();
    }
});
userRoute.post("/", (0, multer_1.default)().fields([
    { name: "name" },
    { name: "email" },
    { name: "password" },
    { name: "passwordConfirm" },
]), async (req, res, next) => {
    try {
        if (req.body.password !== req.body.password_confirm)
            res.status(400).send("Passwords don't match!");
        const checkUnique = await user_1.default.findOne({
            where: {
                email: req.body.email
            }
        });
        if (checkUnique) {
            res.status(400).send("Email is already in our system!");
        }
        await user_1.default.create({
            ...req.body,
        });
        res.status(201).send("User created");
    }
    catch (e) {
        next(e);
    }
});
userRoute.post("/logout", async (req, res, next) => {
    try {
    }
    catch (e) {
        next(e);
    }
});
userRoute.put("/:id", async (req, res, next) => {
    try {
    }
    catch (e) {
        next(e);
    }
});
userRoute.delete("/:id", async (req, res, next) => {
    try {
    }
    catch (e) {
        next(e);
    }
});
exports.default = userRoute;
