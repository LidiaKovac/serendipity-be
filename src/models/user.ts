import { hash } from "bcryptjs"
import mongoose from "mongoose"
import Course from "./course"

const userSchema = new mongoose.Schema<User>({
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
    favs: [{ type: mongoose.Schema.Types.ObjectId, ref: Course }]

}, { collection: "user" })

userSchema.pre("save", async function () {
    this.password = await hash(this.password, process.env.SALT!)
})

export default mongoose.model<User>("User", userSchema) as mongoose.Model<User>