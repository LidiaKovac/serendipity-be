"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const mongoose_1 = __importDefault(require("mongoose"));
const express_list_endpoints_1 = __importDefault(require("express-list-endpoints"));
const user_1 = __importDefault(require("./src/services/user"));
const courses_1 = __importDefault(require("./src/services/courses"));
const server = (0, express_1.default)();
(0, dotenv_1.config)();
server.use("/user", user_1.default);
server.use("/courses", courses_1.default);
const initAPI = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log("DB CONNECTED!");
        server.listen(process.env.PORT || 3000, () => {
            console.table((0, express_list_endpoints_1.default)(server));
        });
    }
    catch (error) {
        console.error("SOMETHING WENT WRONG WITH API INIT", error);
    }
};
initAPI();
