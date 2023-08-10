import { hash } from "bcryptjs"
import mongoose from "mongoose"

const userSchema = new mongoose.Schema<User>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    favs: [String]

}, { collection: "user" })


export default mongoose.model<User>("User", userSchema) as mongoose.Model<User>