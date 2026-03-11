import { Request, Response } from "express";
import { upgradeChirpyRed } from "../db/queries/users.js";
import { BadRequestError } from "./errors.js";
import { getAPIKey } from "../auth.js";
import { envOrThrow } from "../config.js";

export async function handlerPolkaWebhook(req: Request, res: Response) {
    const apiKey = getAPIKey(req);
    const envApiKey = envOrThrow("POLKA_KEY");
    if (apiKey !== envApiKey) {
        res.status(401).send();
        return;
    }

    const { event, data } = req.body;

    if (event !== "user.upgraded") {
        res.status(204).send();
        return;
    }
    
    if (!data || !data.userId) {
        throw new BadRequestError("Missing user ID.");
    }

    const result = await upgradeChirpyRed(data.userId);

    if (!result) {
        res.status(404).send();
        return;
    }
    res.status(204).send();
}
