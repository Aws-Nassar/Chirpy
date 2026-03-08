import { Request, Response } from "express";

export function respondWithError(res: Response, code: number, message: string) {
  respondWithJSON(res, code, { error: message });
}

export function respondWithJSON(res: Response, code: number, payload: any) {
  res.header("Content-Type", "application/json");
  const body = JSON.stringify(payload);
  res.status(code).send(body);
}

export async function handlerChirpsValidate(req: Request, res: Response) {
  // The middleware has already parsed the JSON for us!
  const { body } = req.body;

  if (!body) {
    respondWithError(res, 400, "Missing body");
    return;
  }

  const maxChirpLength = 140;
  if (body.length > maxChirpLength) {
    respondWithError(res, 400, "Chirp is too long");
    return;
  }

  respondWithJSON(res, 200, {
    valid: true,
  });
}