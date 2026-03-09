import type { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { BadRequestError, UnauthorizedError, NotFoundError, ForbiddenError } from "./errors.js";

/*export function middlewareLogResponse(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
        if (res.statusCode < 200 || res.statusCode > 299) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
  });
  next();
}*/ // Not used

export function middlewareMetricsInc (req: Request, res: Response, next: NextFunction) {
    config.fileServerHits++;
    next();
}

export function errorMiddleWare(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
    if (err instanceof BadRequestError) {
        console.error(err.message);
        res.status(400).json({
            error: err.message,
        });
        return;
    }

    if (err instanceof UnauthorizedError) {
        console.error(err.message);
        res.status(401).json({
            error: err.message,
        });
        return;
    }

    if (err instanceof ForbiddenError) {
        console.error(err.message);
        res.status(403).json({
            error: err.message,
        });
        return;
    }

    if (err instanceof NotFoundError) {
        console.error(err.message);
        res.status(404).json({
            error: err.message,
        });
        return;
    }

    console.error(err.message);
    res.status(500).json({
        error: "Something went wrong on our end",
    });
}
