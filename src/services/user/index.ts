//GENERAL
import { Router } from "express"
const userRoute = Router()
import { Request, Response, NextFunction } from "express"
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
            const allUsers = await User.find()
            res.send(allUsers)
        } catch (e) {
            next(e)
        }
    }
)

userRoute.get(
    "/favs", authMidd,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const allUsers = await User.findOne({
                email: req.user.email
            }).populate("favs")
            res.send(allUsers!.favs)
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
    multer().fields([{ name: "email" }, { name: "password" }]),
    async ({ body }: Request, res: Response, next: NextFunction) => {
        try {
            let foundUser = await User.findOne({
                email: body.email,
            })
            const matching = await compare(body.password, foundUser!.password)
            if (foundUser && matching) {
                const token = await generateJWT({
                    lastName: foundUser!.lastName,
                    email: foundUser!.email,
                })
                res
                    .set("Access-Control-Expose-Headers", "token")
                    .set("token", token as string)
                    .sendStatus(200)
            } else res.sendStatus(404)
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

userRoute.patch(
    "/favs/:courseId",
    authMidd,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await User.findOne({ email: req.user.email })
            if (
                user!.favs.some((el) =>
                    new ObjectId(el as ObjectId).equals(new ObjectId(req.params.courseId))
                )
            ) {
                user!.favs = (user?.favs as Course[]).filter((fav: Course) => !new ObjectId(fav._id).equals(new ObjectId(req.params.courseId)))
            } else {
                console.log("adding")
                user!.favs = [...user?.favs as ObjectId[], new ObjectId(req.params.courseId) ]
            }
            await user?.save()
            res.sendStatus(204)
        } catch (error) {
            console.log(error)
            next()
        }
    }
)

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
            if (req.body.password !== req.body.passwordConfirm)
                res.status(400).send("Passwords don't match!")
            const checkUnique = await User.findOne({
                where: {
                    email: req.body.email,
                },
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

userRoute.post(
    "/logout",
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
        } catch (e) {
            next(e)
        }
    }
)

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
