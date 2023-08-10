import { NextFunction, Request, Response, Router } from "express";
import Course from "../../models/course";
import { authMidd } from "../../utils/auth";

const courseRoute=  Router()

courseRoute.get("/", authMidd, async (req:Request, res:Response, next:NextFunction) => {
    try {
        const courses = await Course.find()
        res.send(courses)
    } catch (error) {
        next()
    }
})

export default courseRoute