import { config } from "../config.js";
import type { Request, Response } from "express";

export async function handlerReset (req: Request, res: Response): Promise<void> {
    config.fileServerHits = 0;
    res.status(200).send(`Hits: ${config.fileServerHits}\n`);
}
