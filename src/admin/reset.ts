import { config } from "../config.js";
import type { Request, Response } from "express";

export async function handlerReset (req: Request, res: Response): Promise<void> {
    config.fileserverHits = 0;
    res.status(200).send(`Hits: ${config.fileserverHits}\n`);
}