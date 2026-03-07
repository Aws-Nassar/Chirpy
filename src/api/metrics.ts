import { config } from "../config.js";
import type { Request, Response } from "express";

export async function handlerHits (req: Request, res: Response): Promise<void> {
    res.send(`Hits: ${config.fileserverHits}`);
}