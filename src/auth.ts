import * as argon2 from "argon2";
import { toSnakeCase } from "drizzle-orm/casing";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

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

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
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
