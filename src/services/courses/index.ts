import { NextFunction, Request, Response, Router } from "express";
import Course from "../../models/course";

const courseRoute=  Router()

courseRoute.get("/",async (req:Request, res:Response, next:NextFunction) => {
    try {
        const courses = await Course.find()
        res.send(courses)
    } catch (error) {
        next()
    }
})

export default courseRoute