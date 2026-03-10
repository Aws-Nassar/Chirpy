import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import { UnauthorizedError } from "./api/errors.js";

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function hashPassword(password: string): Promise<string> {
    try {
        const hash = await argon2.hash(password);
        return hash;
    } catch (err) {
        throw new Error("Error occured while hashing the password.")
    }
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    try {
        if (await argon2.verify(hash, password)) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        throw new Error("Error occured while checking the password hash.")
    }
}

export function makeJWT(userID: string, secret: string, expiresIn: number): string {
    const payload: Payload = {
        iss: "chirpy",
        sub: userID,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + expiresIn
    }
    const token = jwt.sign(payload, secret);
    return token;
}

export function validateJWT(tokenString: string, secret: string): string {
    try {
        const decoded = jwt.verify(tokenString, secret) as JwtPayload;
        
        if (typeof decoded === "string") {
            throw new Error("Invalid token payload");
        }

        if (typeof decoded.sub === "undefined") {
            throw new Error("Invalid token payload");
        }

        return decoded.sub;
    } catch(err) {
        throw new Error("Invalid token payload");
    }
}

export function getBearerToken(req: Request): string {
    const auth = req.get('Authorization');

    if (!auth) {
        throw new UnauthorizedError("Failed to get Authorization")
    }
    
    const tokenString = auth.replace("Bearer ", "").trim();
    if (!tokenString || tokenString.length === 0) {
        throw new UnauthorizedError("Failed to get Authorization")
    }
    return tokenString;
}
