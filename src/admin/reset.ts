import { config } from "../config.js";
import type { Request, Response } from "express";
import { deleteAllUsers } from "../db/queries/users.js";
import { ForbiddenError } from "../api/errors.js";

export async function handlerReset (req: Request, res: Response): Promise<void> {
    if (config.api.platform !== "dev") {
        throw new ForbiddenError("403 Forbidden");
    }
    
    config.api.fileServerHits = 0;

    try {
        await deleteAllUsers();
    } catch (err) {
        throw new Error("Some error occured while deleteing all users.")
    }

    res.write("Hits reset to 0");
    res.end();
}
