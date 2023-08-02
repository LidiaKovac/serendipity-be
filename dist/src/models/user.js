"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = require("bcryptjs");
const mongoose_1 = __importDefault(require("mongoose"));
const course_1 = __importDefault(require("./course"));
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    favs: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: course_1.default }]
}, { collection: "user" });
userSchema.pre("save", async function () {
    this.password = await (0, bcryptjs_1.hash)(this.password, process.env.SALT);
});
exports.default = mongoose_1.default.model("User", userSchema);
