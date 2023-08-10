import mongoose from "mongoose"

const courseSchema = new mongoose.Schema<Course>({
    title: String,
    duration: Number,
    level: Number,
    description: String,
    img: String

}, { collection: "courses" })



export default mongoose.model<Course>("Course", courseSchema) as mongoose.Model<Course>