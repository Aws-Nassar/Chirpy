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
    throw new Error("Chirp is too long");
  }

  const profaneWords: string[] = ['kerfuffle', 'sharbert', 'fornax'];
  const cleanBody: Array<string> =  body.split(" ");
  
  for ( let i = 0; i < cleanBody.length; i++) {
    if (profaneWords.includes(cleanBody[i].toLowerCase())) {
      cleanBody[i] = "****";
    }
  }
  

  respondWithJSON(res, 200, {
    cleanedBody: cleanBody.join(" "),
  });
}