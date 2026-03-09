    import { Request, Response } from "express";
    import { BadRequestError } from "./errors.js";
    import { createUser } from "../db/queries/users.js";
    import { respondWithJSON } from "./json.js";

    export async function handlerCreateUser(req: Request, res: Response) {
    const { email } = req.body;

    if (!email || email.length === 0) {
        throw new BadRequestError("Missing email");
    }

    
    const result = await createUser({email});
    
    if (!result) {
        throw new Error("Error occured while inserting the new user.");
    }
    
    respondWithJSON(res, 201, {
        id: result.id,
        email: result.email,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        });
    }