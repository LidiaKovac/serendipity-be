"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMidd = exports.verifyJWT = exports.generateJWT = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const user_1 = __importDefault(require("../models/user"));
const { JWT_SECRET } = process.env;
const generateJWT = (payload) => {
    return new Promise((res, rej) => (0, jsonwebtoken_1.sign)(payload, JWT_SECRET, { expiresIn: "1 day" }, (err, token) => {
        if (err)
            res(err);
        else
            res(token);
    }));
};
exports.generateJWT = generateJWT;
const verifyJWT = (token) => {
    return new Promise((res, rej) => (0, jsonwebtoken_1.verify)(token, JWT_SECRET, (err, decoded) => {
        if (err)
            res(err);
        else
            res(decoded);
    }));
};
exports.verifyJWT = verifyJWT;
const authMidd = async (req, res, next) => {
    if (!req.headers["authorization"])
        res.status(401).send("please send token :(");
    else {
        const decoded = await (0, exports.verifyJWT)(req.headers["authorization"].replace("Bearer ", ""));
        if (decoded.exp) {
            //if there is a token (otherwise it's an error)
            delete decoded.iat;
            delete decoded.exp;
            const me = await user_1.default.findOne({
                where: {
                    ...decoded
                },
                attributes: ["email", "name", "lastName"]
            });
            if (me) {
                req.user = me;
                next();
            }
            else
                res.status(401).send("user is not found :(");
        }
        else
            res.status(401).send("token expired or wrong");
    }
};
exports.authMidd = authMidd;
