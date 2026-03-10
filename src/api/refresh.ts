import { Request, Response } from "express";
import { getUserFromRefreshToken, revokeRefreshToken } from "../db/queries/refresh.js";
import { respondWithJSON } from "./json.js";
import { getBearerToken, makeJWT } from "../auth.js";
import { config } from "../config.js";

export async function handlerRefresh(req: Request, res: Response) {
    const refreshTokenString = getBearerToken(req);
    
    const user = await getUserFromRefreshToken(refreshTokenString);

    if (!user) {
        res.status(401).send("Refresh token is not found or expired or revoked");
        return;
    }

    const newToken = makeJWT(user.user.id, config.jwt.defaultDuration, config.jwt.secret);
    const response = {
        token: newToken,
    }
    respondWithJSON(res, 200, response);
}

export async function handlerRevoke(req: Request, res: Response) {
    const refreshTokenString = getBearerToken(req);
    const result = await revokeRefreshToken(refreshTokenString);
    res.status(204).send();
}
