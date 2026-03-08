import type { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
export function middlewareLogResponse(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
        if (res.statusCode < 200 || res.statusCode > 299) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
  });
  next();
}

export function middlewareMetricsInc (req: Request, res: Response, next: NextFunction) {
    config.fileserverHits++;
    next();
}

export function errorMiddleWare(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(err.message);
  res.status(500).json({
    error: "Something went wrong on our end",
  });
}