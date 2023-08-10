//GENERAL
import { Router } from "express"
const userRoute = Router()
import { Request, Response, NextFunction } from "express"
// import { validateCharacter } from "../../validation/char";
import { compare, hash } from "bcryptjs"
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
    async ({ body }: Request, res: Response, next: NextFunction) => {
        try {
            let foundUser = await User.findOne({
                email: body.email,
            })
            const matching = await compare(body.password, foundUser!.password)
            console.log(matching)
            if(!matching) {
                res.status(404).send("Passwords don't match") 
               return 0
            }
            if (foundUser) {
                const token = await generateJWT({
                    lastName: foundUser!.lastName,
                    email: foundUser!.email,
                })
                res
                    .send({
                        user: foundUser,
                        accessToken: token
                    })
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
    "/:id",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let user = await User.findByIdAndUpdate(req.params.id, {
                favs: req.body.favs
            }, {new: true})
            await user?.save()
            res.send(user)
        } catch (error) {
            console.log(error)
            next()
        }
    }
)

userRoute.post(
    "/",
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            console.log(req.body)
            // if (req.body.password !== req.body.passwordConfirm)
            //     res.status(400).send("Passwords don't match!")
            const checkUnique = await User.findOne({
                where: {
                    email: req.body.email,
                },
            })
            if (checkUnique) {
                res.status(400).send("Email is already in our system!")
            }
            const password = await hash(req.body.password, process.env.SALT!)
            const newUser = await User.create({
                ...req.body,
                password
            })
            res.status(201).send(newUser)
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
