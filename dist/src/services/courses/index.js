"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const course_1 = __importDefault(require("../../models/course"));
const auth_1 = require("../../utils/auth");
const courseRoute = (0, express_1.Router)();
courseRoute.get("/", auth_1.authMidd, async (req, res, next) => {
    try {
        const courses = await course_1.default.find();
        res.send(courses);
    }
    catch (error) {
        next();
    }
});
exports.default = courseRoute;
