//GENERAL
import { Router } from "express"
const userRoute = Router()
import { Request, Response, NextFunction } from "express"
// import { validateCharacter } from "../../validation/char";
import { compare } from "bcryptjs"
import User from "../../models/user"
import { authMidd, generateJWT } from "../../utils/auth"
import multer from "multer"
import { ObjectId } from "mongodb"
//admin middleware
userRoute.get(
    "/",
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const allCharacters = await User.find()
            res.send(allCharacters)
        } catch (e) {
            next(e)
        }
    }
)
userRoute.get(
    "/me",
    authMidd,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.send(req.user)
        } catch (error) {
            next(error)
        }
    }
)

userRoute.post(
    "/login",
    async ({ body }: Request, res: Response, next: NextFunction) => {
        try {
            console.log(body)
            let foundUser = await User.findOne({
                where: {
                    email: body.email,
                },
            })
            if (foundUser && (await compare(body.password, foundUser.password))) {
                const token = await generateJWT({
                    lastName: foundUser!.lastName,
                    email: foundUser!.email,
                })
                res
                    .set("Access-Control-Expose-Headers", "token")
                    .set("token", token as string)
                    .send(200)
            } else res.send(404)
        } catch (error) {
            next(error)
        }
    }
)

userRoute.get(
    "/:id",
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const selectedUser = await User.findById(req.params.id)
            res.send(selectedUser)
        } catch (e) {
            next(e)
        }
    }
)

userRoute.patch("/:id/:courseId", authMidd, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id).populate("favs")
        if ((user!.favs as Course[]).some((el: Course) => new ObjectId(el._id).equals(new ObjectId(req.params.courseId)))) {
            await User.findByIdAndUpdate(req.params.id, {
                $pullAll: {
                    favs: [req.params.courseId]
                }
            })
        } else {
            await User.findByIdAndUpdate(req.params.id, {
                $push: {
                    favs: req.params.courseId
                }
            })
        }
        res.sendStatus(204)
    } catch (error) {
        console.log(error)
        next()
    }
})

userRoute.post(
    "/",
    multer().fields([
        { name: "name" },
        { name: "email" },
        { name: "password" },
        { name: "passwordConfirm" },
    ]),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (req.body.password !== req.body.password_confirm)
                res.status(400).send("Passwords don't match!")
            const checkUnique = await User.findOne({
                where: {
                    email: req.body.email
                }
            })
            if (checkUnique) {
                res.status(400).send("Email is already in our system!")
            }
            await User.create({
                ...req.body,

            })
            res.status(201).send("User created")
        } catch (e) {
            next(e)
        }
    }
)

userRoute.post("/logout", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

    } catch (e) {
        next(e)
    }
})


userRoute.put(
    "/:id",
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
        } catch (e) {
            next(e)
        }
    }
)
userRoute.delete(
    "/:id",
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
        } catch (e) {
            next(e)
        }
    }
)

export default userRoute
