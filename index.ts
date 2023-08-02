import express from "express"
import { config } from "dotenv"
import mongoose from "mongoose"
import listEndpoints from "express-list-endpoints"
import userRoute from "./src/services/user"
import courseRoute from "./src/services/courses"
const server = express()
config()

server.use("/user", userRoute)
server.use("/courses", courseRoute)

const initAPI = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!)
        console.log("DB CONNECTED!")
        server.listen(process.env.PORT || 3000, () => {
            console.table(listEndpoints(server))
        })
    } catch (error) {
        console.error("SOMETHING WENT WRONG WITH API INIT", error)
    }
}
initAPI()