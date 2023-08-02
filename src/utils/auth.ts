import { NextFunction, Request, Response } from "express"
import { sign, verify } from "jsonwebtoken"
import User from "../models/user"
export const generateJWT = (payload: JwtPayload) => {
    return new Promise((res, rej) => sign(payload, process.env.JWT_SECRET!, { expiresIn: "1 day" }, (err, token) => {
        if (err) rej(err)
        else res(token)
    }))
}

export const verifyJWT = (token: string): Promise<JwtPayload | Error> => {
    return new Promise((res, rej) => verify(token, process.env.JWT_SECRET!, (err, decoded) => {
        if (err) res(err)
        else res(decoded as JwtPayload)
    }))
}

export const authMidd = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        if (!req.headers["authorization"]) res.status(401).send("please send token :(")
        else {
        const decoded = await verifyJWT(req.headers["authorization"].replace("Bearer ", "")) as JwtPayload
        if (decoded.exp) {
            //if there is a token (otherwise it's an error)
            delete decoded.iat
            delete decoded.exp
            console.log(decoded)
            const me = await User.findOne({
                    ...decoded,
                    
                })
                if (me) {
                    req.user = me
                    next()
                } else res.status(401).send("user is not found :(")
            } else res.status(401).send("token expired or wrong")
        }
    } catch (error) {
       next(error) 
    }
}