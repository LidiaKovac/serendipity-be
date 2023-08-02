interface User {
    email: string
    password: string
    name: string
    lastName: string
    id: import("mongoose").ObjectId
    favs: import("mongoose").ObjectId[] | Course[]
}

declare namespace Express {
    interface Request {
        user: {
            email: string
            lastName: string
        }
    }
    interface ParsedQs {
        [field: string]: string
    }
}

interface JwtPayload {
    email: string
    lastName: string
    iat?: number
    exp?: number
}

interface Course {
    _id: import("bson").ObjectId
    title: string 
    duration: number 
    level: number 
    description: string 
    img: string
}