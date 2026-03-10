import { Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "./errors.js";
import { createUser, getUserByEmail } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";
import { NewUser } from "../db/schema.js";
import { hashPassword, checkPasswordHash, makeJWT } from "../auth.js"
import { config } from "../config.js";

export type UserResponse = Omit<NewUser, "hashedPassword">;

export async function handlerCreateUser(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || email.length === 0) {
        throw new BadRequestError("Missing email");
    }

    if (!password || password.length === 0) {
        throw new BadRequestError("Missing password");
    }
    const hashedPassword = await hashPassword(password);

    const result = await createUser({ email, hashedPassword });
    
    if (!result) {
        throw new Error("Error occured while inserting the new user.");
    }
    
    const response: UserResponse = {
        id: result.id,
        email: result.email,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
    }
    
    respondWithJSON(res, 201, response);
}


export async function handlerUserLogin(req: Request, res: Response) {
    const { email, password } = req.body;
    const expiresInSeconds = req.body.expiresInSeconds === undefined 
    ? 3600 
    : Math.min(req.body.expiresInSeconds, 3600);

    if (!email || email.length === 0) {
        throw new BadRequestError("Missing email");
    }

    if (!password || password.length === 0) {
        throw new BadRequestError("Missing password");
    }

    const user = await getUserByEmail(email);
    if (!user) {
        throw new UnauthorizedError("Wrong email.");
    }
    
    const checkPassword = await checkPasswordHash(password, user.hashedPassword);

    if (!checkPassword) {
        throw new UnauthorizedError("Wrong password.");
    }

    const token = makeJWT(user.id, config.jwt.secret, expiresInSeconds);

    const response = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        token: token,
    }
    
    respondWithJSON(res, 200, response);    
}
